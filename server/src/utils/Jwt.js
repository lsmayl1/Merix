import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Read lazily so dotenv timing issues don't affect module initialization
const accessSecret  = () => process.env.JWT_ACCESS_SECRET  || (() => { throw new Error("JWT_ACCESS_SECRET not set");  })();
const refreshSecret = () => process.env.JWT_REFRESH_SECRET || (() => { throw new Error("JWT_REFRESH_SECRET not set"); })();

const generateAccessToken = (payload) =>
  jwt.sign(payload, accessSecret(), {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  });

const generateRefreshToken = (payload) =>
  jwt.sign(payload, refreshSecret(), {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  });

const verifyToken = (token, type = "access") => {
  try {
    return jwt.verify(token, type === "access" ? accessSecret() : refreshSecret());
  } catch {
    return null;
  }
};

export { generateAccessToken, generateRefreshToken, verifyToken };
