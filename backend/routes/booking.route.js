import express from "express";
import {
  createSession,
  deleteBooking,
  getAvailableVehicles,
  getBookingById,
  getBookings,
  getBookingsByUserId,
  paymentSuccessful,
} from "../controllers/booking.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/available-vehicles", getAvailableVehicles);
router.get("/get-bookings", getBookings);
router.get("/get-booking/:id", verifyToken, getBookingById);
router.delete("/delete/:id", verifyToken, deleteBooking);
router.get("/user/:userId", verifyToken, getBookingsByUserId);
router.post("/payment/create-session", createSession);
router.post("/payment-success", paymentSuccessful);

export default router;
