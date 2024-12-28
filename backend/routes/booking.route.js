import express from "express";
import {
  createBooking,
  getAvailableVehicles,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/add-booking", createBooking);
router.get("/available-vehicles", getAvailableVehicles);

export default router;
