import bcrypt from "bcrypt";
import { generateToken } from "../middleware/generateToken.js";
import User from "../models/user.model.js";

// Sign up a new user
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate a JWT token
    const token = await generateToken(newUser._id);

    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
        sameSite: "None",
      })
      .json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Sign in an existing user
export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate a JWT token
    const token = await generateToken(existingUser._id);

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
        sameSite: "None",
      })
      .json({ user: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
