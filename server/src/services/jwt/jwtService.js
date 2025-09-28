import jwt, { decode } from "jsonwebtoken";
import { AppError } from "../../utils/AppError.js";
import dotenv from "dotenv";
dotenv.config();
const SECRET_KEY = process.env.JWT_ACCESS_SECRET;

const jwtService = {
  signToken: (payload, expiresIn = "1h") => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
  },
  signRefreshToken: (payload, expiresIn = "7d") => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
  },
  verifyToken: (token) => {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      throw new AppError("Invalid or expired token", 401);
    }
  },

  decodeToken: (token) => {
    return decode(token);
  },
};

export default jwtService;
