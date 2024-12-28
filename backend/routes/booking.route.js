import express from "express";
import { createBooking } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/add-booking", createBooking);

export default router;
