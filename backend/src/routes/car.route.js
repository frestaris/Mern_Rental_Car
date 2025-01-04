import express from "express";
import {
  addCar,
  deleteCar,
  getCarById,
  getCars,
  updateCar,
} from "../controllers/car.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/add-car", verifyToken, addCar);
router.get("/get-cars", getCars);
router.get("/get-car/:id", getCarById);
router.put("/update-car/:id", verifyToken, updateCar);
router.delete("/delete-car/:carId", verifyToken, deleteCar);

export default router;
