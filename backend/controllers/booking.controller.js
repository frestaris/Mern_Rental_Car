import Booking from "../models/booking.model.js";
import Car from "../models/car.model.js";
import User from "../models/user.model.js";
import Stripe from "stripe";
import moment from "moment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// GET AVAILABLE VEHICLES
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

    // Fetch all bookings
    const availableBookings = await Car.find();

    // Check car availability for the date range
    const availableCarIds = [];
    for (const car of availableBookings) {
      const existingBooking = await Booking.findOne({
        car: car._id,
        $or: [
          { startDate: { $lt: end }, endDate: { $gt: start } }, // Check if there is an overlap with the selected dates
        ],
      });

      // If no existing booking is found, the car is available
      if (!existingBooking && car.status !== "booked") {
        availableCarIds.push(car._id);
      }
    }

    // Return available bookings
    const bookings = await Car.find({ _id: { $in: availableCarIds } });

    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No available bookings for the selected dates." });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// GET ALL BOOKINGS
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user").populate("car");

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

// GET A BOOKING BY ID
export const getBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findById(id).populate("user").populate("car");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error.message);
    res.status(500).json({ message: "Error fetching booking" });
  }
};

// DELETE A BOOKING BY ID
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ error: "You are not allowed to delete cars" });
    }
    // Find the booking to delete
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Find the car associated with the booking
    const car = await Car.findById(booking.car);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Update car status to "available"
    car.status = "available";
    await car.save();

    // Remove the booking from the user's list of bookings
    const user = await User.findById(booking.user);
    if (user) {
      user.bookings = user.bookings.filter(
        (bookingId) => bookingId.toString() !== id
      );
      await user.save();
    }

    // Delete the booking
    await booking.deleteOne();

    res.status(200).json({ message: "Booking successfully deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting booking", error: error.message });
  }
};

export const getBookingsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ user: userId });

    // If no bookings found
    if (!bookings || bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user." });
    }

    // Respond with bookings
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Could not fetch bookings." });
  }
};

// CREATE STRIPE SESSION
export const createSession = async (req, res) => {
  const { bookingData } = req.body;
  if (
    !bookingData ||
    !bookingData.totalDays ||
    !bookingData.totalCost ||
    !bookingData.carId ||
    !bookingData.carId.name ||
    !bookingData.carId.image
  ) {
    return res.status(400).json({ error: "Missing required booking data." });
  }

  try {
    const carImage = bookingData.carId.image;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Car rental: ${bookingData.carId.name}`,
              images: [carImage],
              description: `Total Days: ${bookingData.totalDays}`,
            },
            unit_amount: bookingData.totalCost * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/payment-cancel`,
      metadata: {
        userId: bookingData.userId,
        carId: bookingData.carId._id,
        pickupLocation: bookingData.pickupLocation,
        dropoffLocation: bookingData.dropoffLocation,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalCost: bookingData.totalCost,
        totalDays: bookingData.totalDays,
      },
    });
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Payment session creation failed.");
  }
};

// ADD BOOKING FROM STRIPE
export const paymentSuccessful = async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) {
    return res.status(400).json({ message: "Session ID is missing." });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    const {
      carId,
      userId,
      pickupLocation,
      dropoffLocation,
      startDate,
      endDate,
    } = session.metadata;

    if (!carId) {
      return res
        .status(400)
        .json({ message: "Car ID is missing in session metadata." });
    }

    const existingBooking = await Booking.findOne({ session_id: session_id });
    if (existingBooking) {
      return res.status(200).json(existingBooking);
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found." });
    }

    if (!car.pricePerDay) {
      return res
        .status(400)
        .json({ message: "Car daily rate is not defined." });
    }

    const daysDifference = moment(endDate).diff(moment(startDate), "days");
    const totalCost = car.pricePerDay * daysDifference;

    if (isNaN(totalCost) || totalCost <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid total cost calculation." });
    }

    // Create new booking
    const newBooking = await Booking.create({
      user: userId,
      car: carId,
      pickupLocation,
      dropoffLocation,
      startDate: moment(startDate).format("YYYY-MM-DD"),
      endDate: moment(endDate).format("YYYY-MM-DD"),
      totalCost,
      status: "confirmed",
      session_id: session_id,
    });

    await newBooking.save();

    car.status = "booked";
    await car.save();

    // Add booking to the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.bookings.push(newBooking._id);
    await user.save();

    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
