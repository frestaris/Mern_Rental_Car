import express from "express";
import { addCar, getCars } from "../controllers/car.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/add-car", verifyToken, addCar);
router.get("/get-cars", getCars);

export default router;
