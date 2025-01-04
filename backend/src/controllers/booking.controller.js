import Booking from "../models/booking.model.js";
import Car from "../models/car.model.js";
import User from "../models/user.model.js";
import Stripe from "stripe";

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

    // Query for available cars and their bookings at once
    const allCars = await Car.find({
      status: { $ne: "not available" }, // Only consider available cars
    });

    // Fetch bookings that overlap with the requested dates
    const conflictingBookings = await Booking.find({
      $or: [{ startDate: { $lt: end }, endDate: { $gt: start } }],
    });

    // Filter cars that are not conflicting with any booking
    const availableCars = allCars.filter((car) => {
      // Check if there's a conflicting booking for this car
      return !conflictingBookings.some(
        (booking) => booking.car.toString() === car._id.toString()
      );
    });

    if (availableCars.length === 0) {
      return res
        .status(404)
        .json({ message: "No available vehicles for the selected dates." });
    }

    res.status(200).json(availableCars);
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

    // Check if the user is an admin
    if (req.user.isAdmin) {
      // Admin can delete any booking
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

      return res.status(200).json({ message: "Booking successfully deleted" });
    }

    // If the user is not an admin, they can only delete their own booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the booking belongs to the logged-in user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "You can only delete your own booking",
      });
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
    const bookings = await Booking.find({ user: userId }).populate("car");

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
              name: `Car: ${bookingData.carId.name}`,
              images: [carImage],
              description: `CARD DETAILS FOR TESTING PURPOSES: 4242 4242 4242 4242`,
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
        pickupTime: bookingData.pickupTime,
        dropoffTime: bookingData.dropoffTime,
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

// ADD BOOKING WITHOUT STRIPE
export const addBookingWithoutStripe = async (req, res) => {
  try {
    const {
      userId,
      carId,
      pickupLocation,
      dropoffLocation,
      pickupTime,
      dropoffTime,
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
    } // Check car availability
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
    } // Calculate rental days and total cost
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
    } // Create booking
    const newBooking = await Booking.create({
      user: userId,
      car: carId,
      pickupLocation,
      dropoffLocation,
      startDate: start,
      endDate: end,
      pickupTime,
      dropoffTime,
      totalCost,
      status: "confirmed",
    });

    car.status = "booked";
    await car.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    user.bookings.push(newBooking._id);

    await user.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
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
      pickupTime,
      dropoffTime,
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

    const rentalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (rentalDays <= 0) {
      return res
        .status(400)
        .json({ message: "Booking duration must be at least one day." });
    }

    const totalCost = rentalDays * car.pricePerDay;

    if (isNaN(totalCost) || totalCost <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid total cost calculation." });
    }

    const newBooking = await Booking.create({
      user: userId,
      car: carId,
      pickupLocation,
      dropoffLocation,
      startDate: start,
      endDate: end,
      pickupTime,
      dropoffTime,
      totalCost,
      status: "confirmed",
      session_id: session_id,
    });

    await newBooking.save();

    car.status = "booked";
    await car.save();

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
