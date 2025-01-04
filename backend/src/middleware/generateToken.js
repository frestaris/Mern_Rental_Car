import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET_KEY is not set in environment variables");
}

export const generateToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      JWT_SECRET,
      {
        expiresIn: "12h",
      }
    );
    return token;
  } catch (error) {
    console.error("Error generating token:", error.message);
    throw new Error("Token generation failed");
  }
};
