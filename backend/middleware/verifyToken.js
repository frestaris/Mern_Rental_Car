import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET_KEY is not set in environment variables");
}

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send({ message: "Invalid Token" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return res.status(401).send({ message: "Invalid Token" });
    }
    req.user = decoded.userId;
    next();
  } catch (error) {
    console.log("Error while verifying token", error);
    return res.status(401).send({ message: "Error while verifying Token" });
  }
};
