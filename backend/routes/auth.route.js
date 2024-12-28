import express from "express";
import {
  signup,
  signin,
  getUsers,
  deleteUser,
  updateUser,
  getUserById,
} from "../controllers/auth.controllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/get-users", verifyToken, getUsers);
router.get("/get-user/:id", verifyToken, getUserById);
router.put("/update-user/:id", verifyToken, updateUser);
router.delete("/delete-user/:userId", verifyToken, deleteUser);

export default router;
