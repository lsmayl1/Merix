import { AppError } from "../utils/AppError.js";
import { validateErpSession } from "../services/erp/ErpAuthService.js";

const VALID_TOKENS = (process.env.SYNC_TOKENS || "merix-sync-token-change-me")
  .split(",")
  .map((t) => t.trim());

export const validateSyncAuth = async (req, res, next) => {
  try {
    const auth = req.headers["authorization"];
    if (!auth || !auth.startsWith("Bearer ")) {
      throw new AppError("Missing or invalid Authorization header", 401);
    }

    const token = auth.slice(7);
    if (!VALID_TOKENS.includes(token)) {
      throw new AppError("Invalid sync token", 401);
    }

    const tenantId = req.headers["x-tenant-id"] || null;
    if (!tenantId || tenantId === "unknown") {
      throw new AppError("x-tenant-id header is required and must be a valid tenant", 400);
    }

    const userId   = req.headers["x-user-id"];
    const deviceId = req.headers["x-device-id"];

    // Validate user/device if headers provided (not required for backward compat)
    if (userId && deviceId) {
      const result = await validateErpSession({ userId, deviceId, tenantId });
      if (!result.valid) {
        throw new AppError(`Sync rejected: ${result.reason}`, 403);
      }
    }

    // Ensure a Client row exists for this tenantId.
    // A minimal stub is created if missing — handleCompany will fill in the real name
    // when the company entity syncs.
    try {
      const { Client } = await import("../models/index.js");
      const exists = await Client.findByPk(tenantId);
      if (!exists) {
        await Client.create({
          id:     tenantId,
          name:   `ERP Device ${tenantId.slice(0, 8)}`,
          status: "active",
        });
        console.log(`[sync] auto-created client stub for tenant ${tenantId}`);
      }
    } catch (clientErr) {
      console.warn("[sync] auto-create client failed:", clientErr.message);
    }

    req.syncContext = {
      tenantId,
      branchId: req.headers["x-branch-id"] || "main",
      userId:   userId || null,
      deviceId: deviceId || null,
      clientVersion: req.headers["x-client-version"] || "unknown",
    };

    next();
  } catch (err) {
    next(err);
  }
};
