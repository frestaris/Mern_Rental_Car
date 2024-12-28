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

export const getAvailableVehicles = async (req, res) => {
  try {
    const { pickupDate, dropoffDate } = req.query;

    // Validate dates
    const start = new Date(pickupDate);
    const end = new Date(dropoffDate);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: "Invalid date format." });
    }
    if (start >= end) {
      return res
        .status(400)
        .json({ message: "Drop-off date must be after the pickup date." });
    }

    // Fetch all cars
    const availableCars = await Car.find();

    // Check car availability for the date range
    const availableCarIds = [];
    for (const car of availableCars) {
      const existingBooking = await Booking.findOne({
        car: car._id,
        $or: [
          { startDate: { $lt: end }, endDate: { $gt: start } }, // Check if there is an overlap with the selected dates
        ],
      });

      // If no existing booking is found, the car is available
      if (!existingBooking) {
        availableCarIds.push(car._id);
      }
    }

    // Return available cars
    const cars = await Car.find({ _id: { $in: availableCarIds } });

    if (cars.length === 0) {
      return res
        .status(404)
        .json({ message: "No available cars for the selected dates." });
    }

    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
