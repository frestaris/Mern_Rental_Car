import express from "express";
import { addCar } from "../controllers/car.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/add-car", verifyToken, addCar);

export default router;
