import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET_KEY is not set in environment variables");
}

export const verifyToken = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req?.cookies?.token;

  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: "No entry without authentication" });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userFound = await User.findById(user.id).select("-password");

    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = userFound;
    next();
  } catch (error) {
    console.error("Error authenticating user", error);
    return res
      .status(500)
      .json({ message: "Error authenticating user", error: error.message });
  }
};
