import express from "express";
import Car from "../models/car.model.js";

const router = express.Router();

// POST A CAR
export const addCar = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

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

    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cars" });
  }
};

export default router;
