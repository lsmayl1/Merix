import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { User, Client, ClientDevice, License } from "../../models/index.js";
import { AppError } from "../../utils/AppError.js";
import jwtService from "../jwt/jwtService.js";
import { generateOfflineToken } from "./OfflineTokenService.js";

/**
 * Find or register a device for a given client.
 * Returns the ClientDevice record.
 */
const upsertDevice = async ({ clientId, machineFingerprint, deviceName, transaction }) => {
  let device = await ClientDevice.findOne({
    where: { clientId, machineFingerprint },
    transaction,
  });

  if (!device) {
    device = await ClientDevice.create(
      {
        clientId,
        deviceId: randomUUID(),
        deviceName: deviceName || "POS Terminal",
        machineFingerprint,
        status: "active",
        registeredAt: new Date(),
        lastSeenAt: new Date(),
      },
      { transaction },
    );
  } else {
    if (device.status === "revoked") {
      throw new AppError("This device has been revoked. Contact support.", 403);
    }
    if (device.status === "suspended") {
      throw new AppError("This device is suspended.", 403);
    }
    await device.update({ lastSeenAt: new Date() }, { transaction });
  }

  return device;
};

/**
 * Get active license for a client. Returns null if none exists (trial grace).
 */
const getLicense = async (clientId, transaction) => {
  const license = await License.findOne({
    where: { client_id: clientId, status: "active" },
    order: [["issued_at", "DESC"]],
    transaction,
  });
  return license;
};

/**
 * Main ERP login flow.
 * 1. Authenticate user credentials
 * 2. Register/validate device
 * 3. Check license
 * 4. Generate tokens + offline token + full profile
 */
export const erpLogin = async ({ email, password, machineFingerprint, deviceName }) => {
  if (!email || !password) throw new AppError("Email and password are required", 400);
  if (!machineFingerprint) throw new AppError("machineFingerprint is required", 400);

  const user = await User.findOne({ where: { email } });
  if (!user) throw new AppError("Invalid credentials", 401);
  if (user.status === "inactive" || user.status === "suspended") {
    throw new AppError("Your account is disabled. Contact your administrator.", 403);
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError("Invalid credentials", 401);

  // Resolve clientId
  let clientId = user.clientId;
  if (!clientId) {
    // 1. Try to find the client via the device fingerprint (this machine was already registered)
    if (machineFingerprint) {
      const existingDevice = await ClientDevice.findOne({ where: { machineFingerprint } });
      if (existingDevice) {
        clientId = existingDevice.clientId;
        await user.update({ clientId });
      }
    }

    // 2. Fall back to the sole client if there is exactly one
    if (!clientId) {
      const allClients = await Client.findAll({ limit: 2 });
      if (allClients.length === 1) {
        clientId = allClients[0].id;
        await user.update({ clientId });
      } else {
        throw new AppError(
          "This user is not assigned to a company. Open the Admin panel → Clients → select a client → Add User.",
          400,
        );
      }
    }
  }

  const client = await Client.findByPk(clientId);
  if (!client) throw new AppError("Tenant not found", 404);
  if (client.status && client.status !== "active") {
    throw new AppError("Tenant account is inactive", 403);
  }

  // Register / validate device
  const device = await upsertDevice({
    clientId,
    machineFingerprint,
    deviceName,
  });

  // License check (soft — warn but allow if no license, let grace period handle it)
  const license = await getLicense(clientId);
  const licenseStatus = license
    ? { id: license.id, type: license.type, status: license.status, expiresAt: license.expiresAt }
    : { id: null, type: "none", status: "none", expiresAt: null };

  // Build profile payload
  const profile = {
    id:         user.id,
    email:      user.email,
    firstName:  user.firstName,
    lastName:   user.lastName,
    full_name:  `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
    role:       user.role || "cashier",
    permissions: user.permissions || [],
    tenantId:   client.id,
    tenantName: client.name,
    deviceId:   device.deviceId,
    license:    licenseStatus,
  };

  // Generate tokens
  const accessToken = jwtService.signToken(
    { userId: user.id, role: user.role || "cashier", tenantId: client.id },
    "2h",
  );
  const refreshToken = jwtService.signRefreshToken(
    { userId: user.id, tenantId: client.id },
    "30d",
  );

  // Generate offline token (signed, 30-day JWT)
  const offlineToken = generateOfflineToken({
    userId: user.id,
    tenantId: client.id,
    branchId: "main",
    role: user.role || "cashier",
    permissions: user.permissions || [],
    licenseId: license?.id || null,
    deviceId: device.deviceId,
  });

  return {
    accessToken,
    refreshToken,
    offlineToken,
    profile,
    deviceId: device.deviceId,
  };
};

/**
 * Validate that a user + device are still active (called during sync).
 */
export const validateErpSession = async ({ userId, deviceId, tenantId }) => {
  const user = await User.findByPk(userId);
  if (!user) return { valid: false, reason: "USER_NOT_FOUND" };
  if (user.status !== "active") return { valid: false, reason: "USER_DISABLED" };
  if (String(user.clientId) !== String(tenantId)) return { valid: false, reason: "TENANT_MISMATCH" };

  const device = await ClientDevice.findOne({ where: { deviceId } });
  if (!device) return { valid: false, reason: "DEVICE_NOT_FOUND" };
  if (device.status !== "active") return { valid: false, reason: "DEVICE_NOT_ACTIVE" };

  const license = await getLicense(user.clientId || tenantId);
  const now = new Date();
  if (license && license.expiresAt && now > new Date(license.expiresAt)) {
    const graceDays = license.gracePeriodDays || 7;
    const graceCutoff = new Date(license.expiresAt);
    graceCutoff.setDate(graceCutoff.getDate() + graceDays);
    if (now > graceCutoff) return { valid: false, reason: "LICENSE_EXPIRED" };
  }

  // Update last seen
  await device.update({ lastSeenAt: new Date() });

  return { valid: true };
};

/**
 * Refresh tokens for an ERP device.
 */
export const refreshErpTokens = async ({ userId, deviceId }) => {
  const user = await User.findByPk(userId);
  if (!user || user.status !== "active") throw new AppError("User not found or disabled", 401);

  const device = await ClientDevice.findOne({ where: { deviceId } });
  if (!device || device.status !== "active") throw new AppError("Device not active", 401);

  const client = await Client.findByPk(user.clientId);
  const license = await getLicense(user.clientId);

  const profile = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role || "cashier",
    permissions: user.permissions || [],
    tenantId: client?.id,
  };

  const accessToken = jwtService.signToken(
    { userId: user.id, role: user.role || "cashier", tenantId: client?.id },
    "2h",
  );

  const offlineToken = generateOfflineToken({
    userId: user.id,
    tenantId: client?.id,
    role: user.role || "cashier",
    permissions: user.permissions || [],
    licenseId: license?.id || null,
    deviceId,
  });

  await device.update({ lastSeenAt: new Date() });

  return {
    accessToken,
    offlineToken,
    profile,
    license: license
      ? { licenseKey: license.licenseKey, expiresAt: license.expiresAt, type: license.type, status: license.status }
      : null,
  };
};
