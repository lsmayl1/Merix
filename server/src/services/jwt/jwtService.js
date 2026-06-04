import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AppError } from "../../utils/AppError.js";

dotenv.config(); // load .env relative to cwd — safe to call multiple times

const accessSecret = () => {
  const s = process.env.JWT_ACCESS_SECRET;
  if (!s) throw new AppError("JWT_ACCESS_SECRET is not configured", 500);
  return s;
};

const refreshSecret = () => {
  const s = process.env.JWT_REFRESH_SECRET;
  if (!s) throw new AppError("JWT_REFRESH_SECRET is not configured", 500);
  return s;
};

const jwtService = {
  signToken: (payload, expiresIn = "1h") =>
    jwt.sign(payload, accessSecret(), { expiresIn }),

  signRefreshToken: (payload, expiresIn = "7d") =>
    jwt.sign(payload, refreshSecret(), { expiresIn }),

  verifyToken: (token) => {
    try {
      return jwt.verify(token, accessSecret());
    } catch (error) {
      throw new AppError("Invalid or expired token", 401);
    }
  },

  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, refreshSecret());
    } catch (error) {
      throw new AppError("Invalid or expired refresh token", 401);
    }
  },

  decodeToken: (token) => jwt.decode(token),
};

export default jwtService;
