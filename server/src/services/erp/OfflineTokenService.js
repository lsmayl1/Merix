import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const OFFLINE_EXPIRES_IN = "30d";

const offlineSecret = () => {
  const s = process.env.OFFLINE_TOKEN_SECRET;
  if (!s) throw new Error("OFFLINE_TOKEN_SECRET is not configured in .env");
  return s;
};

/**
 * Generate a signed offline JWT that MerixERP stores and uses for offline login.
 */
export const generateOfflineToken = ({
  userId,
  tenantId,
  branchId = "main",
  role,
  permissions = [],
  licenseId,
  deviceId,
}) => {
  const payload = {
    userId,
    tenantId,
    branchId,
    role,
    permissions,
    licenseId: licenseId || null,
    deviceId,
    type: "offline",
  };

  return jwt.sign(payload, offlineSecret(), { expiresIn: OFFLINE_EXPIRES_IN });
};

/**
 * Verify an offline token (used on Admin side during sync validation).
 */
export const verifyOfflineToken = (token) =>
  jwt.verify(token, offlineSecret());
