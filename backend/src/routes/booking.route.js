import express from "express";
import {
  addBookingWithoutStripe,
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
router.post("/add-booking", verifyToken, addBookingWithoutStripe);
router.get("/get-bookings", getBookings);
router.get("/get-booking/:id", verifyToken, getBookingById);
router.delete("/delete/:id", verifyToken, deleteBooking);
router.get("/user/:userId", verifyToken, getBookingsByUserId);
router.post("/payment/create-session", createSession);
router.get("/payment-success", paymentSuccessful);

export default router;
