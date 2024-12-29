import express from "express";
import {
  createBooking,
  getAvailableVehicles,
  getBookingById,
  getBookings,
} from "../controllers/booking.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/add-booking", createBooking);
router.get("/available-vehicles", getAvailableVehicles);
router.get("/get-bookings", verifyToken, getBookings);
router.get("/get-booking/:id", verifyToken, getBookingById);

export default router;
