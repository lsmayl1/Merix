import express from "express";
import { AppError } from "../../utils/AppError.js";
import { erpLogin, refreshErpTokens, validateErpSession } from "../../services/erp/ErpAuthService.js";

const router = express.Router();

/**
 * POST /api/erp/auth/login
 * Called by MerixERP on user login.
 * Returns: accessToken, refreshToken, offlineToken, profile, deviceId
 */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password, machineFingerprint, deviceName } = req.body;
    const result = await erpLogin({ email, password, machineFingerprint, deviceName });
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/erp/auth/refresh
 * Called by MerixERP SyncWorker to rotate tokens.
 * Body: { userId, deviceId }
 */
router.post("/refresh", async (req, res, next) => {
  try {
    const { userId, deviceId } = req.body;
    if (!userId || !deviceId) throw new AppError("userId and deviceId are required", 400);
    const result = await refreshErpTokens({ userId, deviceId });
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/erp/auth/validate
 * Called during sync to confirm user + device + license are still valid.
 * Body: { userId, deviceId, tenantId }
 */
router.post("/validate", async (req, res, next) => {
  try {
    const { userId, deviceId, tenantId } = req.body;
    if (!userId || !deviceId || !tenantId) {
      throw new AppError("userId, deviceId, and tenantId are required", 400);
    }
    const result = await validateErpSession({ userId, deviceId, tenantId });
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/erp/auth/me
 * Returns fresh profile for an authenticated ERP user.
 * Header: Authorization: Bearer <accessToken>
 */
router.get("/me", async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) throw new AppError("Unauthorized", 401);

    const token = authHeader.slice(7);
    let payload;
    try {
      const { default: jwtService } = await import("../../services/jwt/jwtService.js");
      payload = jwtService.verifyToken(token);
    } catch {
      throw new AppError("Invalid or expired token", 401);
    }

    const { User, Client, ClientDevice, License } = await import("../../models/index.js");
    const user = await User.findByPk(payload.userId);
    if (!user) throw new AppError("User not found", 404);

    const client = user.clientId ? await Client.findByPk(user.clientId) : null;
    const device = payload.deviceId
      ? await ClientDevice.findOne({ where: { deviceId: payload.deviceId } })
      : null;
    const license = client
      ? await License.findOne({ where: { client_id: client.id, status: "active" }, order: [["issued_at", "DESC"]] })
      : null;

    const profile = {
      id:         user.id,
      email:      user.email,
      full_name:  `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
      firstName:  user.firstName,
      lastName:   user.lastName,
      role:       user.role || "cashier",
      permissions: user.permissions || [],
      tenantId:   client?.id    ?? null,
      tenantName: client?.name  ?? null,
      deviceId:   device?.deviceId ?? payload.deviceId ?? null,
      license:    license
        ? { id: license.id, type: license.type, status: license.status, expiresAt: license.expiresAt }
        : { id: null, type: "none", status: "none", expiresAt: null },
    };

    res.json({ success: true, profile });
  } catch (err) {
    next(err);
  }
});

export { router };
