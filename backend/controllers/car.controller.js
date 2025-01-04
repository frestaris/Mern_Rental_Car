import express from "express";
import Car from "../models/car.model.js";
import Booking from "../models/booking.model.js";

const router = express.Router();

// POST A CAR
export const addCar = async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.category ||
      !req.body.pricePerDay ||
      !req.body.seats ||
      !req.body.transmission ||
      !req.body.fuelConsumption ||
      !req.body.image
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: All fields are required, including the image.",
      });
    }

    const newCar = new Car({
      name: req.body.name,
      category: req.body.category,
      pricePerDay: req.body.pricePerDay,
      seats: req.body.seats,
      transmission: req.body.transmission,
      fuelConsumption: req.body.fuelConsumption,
      image: req.body.image,
    });

    const savedCar = await newCar.save();

    res.status(201).json(savedCar);
  } catch (error) {
    console.error("Error creating car:", error.message);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: error.message,
      });
    }
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

// GET ALL VEHICLES
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find();

    for (const car of cars) {
      const currentDate = new Date();
      const booking = await Booking.findOne({ car: car._id });

      if (booking && new Date(booking.endDate) < currentDate) {
        car.status = "available";
        await car.save();
      }
    }

    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cars" });
  }
};

// GET A VEHICLE BY ID
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById({ _id: req.params.id });

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching car" });
  }
};

// UPDATE VEHICLE
export const updateCar = async (req, res) => {
  try {
    const {
      name,
      category,
      pricePerDay,
      seats,
      transmission,
      fuelConsumption,
      image,
    } = req.body;

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        pricePerDay,
        seats,
        transmission,
        fuelConsumption,
        image,
      },
      { new: true }
    );

    if (!updatedCar) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.status(200).json(updatedCar);
  } catch (error) {
    console.error("Error updating car:", error.message);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

// DELETE VEHICLE
export const deleteCar = async (req, res) => {
  try {
    const id = req.params.carId;

    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ error: "You are not allowed to delete cars" });
    }

    if (!id) {
      return res.status(403).json({ error: "Car not found" });
    }

    const car = await Car.findByIdAndDelete(id);

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.status(200).json({ message: "Car has been deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default router;
