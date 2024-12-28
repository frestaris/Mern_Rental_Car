import Booking from "../models/booking.model.js";
import Car from "../models/car.model.js";

export const createBooking = async (req, res) => {
  try {
    const {
      userId,
      carId,
      pickupLocation,
      dropoffLocation,
      startDate,
      endDate,
    } = req.body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: "Invalid date format." });
    }
    if (start >= end) {
      return res
        .status(400)
        .json({ message: "End date must be after start date." });
    }

    // Check car availability
    const existingBooking = await Booking.findOne({
      car: carId,
      $or: [{ startDate: { $lt: end }, endDate: { $gt: start } }],
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "Car is unavailable for the selected dates." });
    }

    // Fetch car details
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found." });
    }
    if (!car.pricePerDay) {
      return res
        .status(400)
        .json({ message: "Car daily rate is not defined." });
    }

    // Calculate rental days and total cost
    const rentalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (rentalDays <= 0) {
      return res
        .status(400)
        .json({ message: "Booking duration must be at least one day." });
    }
    const totalCost = rentalDays * car.pricePerDay;

    // Validate total cost
    if (isNaN(totalCost) || totalCost <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid total cost calculation." });
    }

    // Create booking
    const newBooking = await Booking.create({
      user: userId,
      car: carId,
      pickupLocation,
      dropoffLocation,
      startDate: start,
      endDate: end,
      totalCost,
      status: "pending",
    });

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
