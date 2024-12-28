import express from "express";
import { addCar, deleteCar, getCars } from "../controllers/car.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/add-car", verifyToken, addCar);
router.get("/get-cars", getCars);
router.delete("/delete-car/:carId", verifyToken, deleteCar);

export default router;
