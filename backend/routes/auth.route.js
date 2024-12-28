import express from "express";
import {
  signup,
  signin,
  getUsers,
  deleteUser,
} from "../controllers/auth.controllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/get-users", verifyToken, getUsers);
router.delete("/delete-user/:userId", verifyToken, deleteUser);

export default router;
