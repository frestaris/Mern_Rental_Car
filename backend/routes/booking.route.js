import express from "express";
import {
  createSession,
  getAvailableVehicles,
  getBookingById,
  getBookings,
  getBookingsByUserId,
  paymentSuccessful,
} from "../controllers/booking.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/available-vehicles", getAvailableVehicles);
router.get("/get-bookings", verifyToken, getBookings);
router.get("/get-booking/:id", verifyToken, getBookingById);
router.get("/user/:userId", verifyToken, getBookingsByUserId);
router.post("/payment/create-session", createSession);
router.post("/payment-success", paymentSuccessful);

export default router;
