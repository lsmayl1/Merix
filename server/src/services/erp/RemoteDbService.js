import pg from "pg";
import crypto from "crypto";
import { User, Client, ClientDevice, License } from "../../models/index.js";
import { AppError } from "../../utils/AppError.js";

const { Client: PgClient } = pg;

const ONLINE_DB_SECRET = process.env.ERP_ONLINE_DB_SECRET;
const PUBLIC_DB_HOST = process.env.ERP_ONLINE_DB_HOST || "87.106.224.203";
const PUBLIC_DB_PORT = parseInt(process.env.ERP_ONLINE_DB_PORT || "5432", 10);

/** Deterministic per-tenant DB password — no extra storage needed. */
const tenantDbPassword = (dbName) =>
  crypto.createHmac("sha256", ONLINE_DB_SECRET).update(dbName).digest("hex").slice(0, 32);

const quoteLiteral = (s) => `'${String(s).replace(/'/g, "''")}'`;

/**
 * Validate user + device + license, then ensure a per-tenant PostgreSQL
 * database (and role) exists on this server for "online mode" ERP clients
 * whose local database is unavailable.
 *
 * Each tenant gets its own role that can connect only to its own database,
 * so one tenant's credentials are useless against another tenant's data.
 *
 * Returns connection credentials the ERP backend can plug into Sequelize.
 */
export const provisionRemoteDb = async ({ userId, deviceId }) => {
  if (!ONLINE_DB_SECRET) {
    throw new AppError("Online mode is not configured on this server", 503);
  }

  const user = await User.findByPk(userId);
  if (!user || user.status !== "active") throw new AppError("User not found or disabled", 401);

  const device = await ClientDevice.findOne({ where: { deviceId } });
  if (!device || device.status !== "active") throw new AppError("Device not active", 401);
  if (String(device.clientId) !== String(user.clientId)) {
    throw new AppError("Device does not belong to this tenant", 403);
  }

  const tenant = await Client.findByPk(user.clientId);
  if (!tenant) throw new AppError("Tenant not found", 404);
  if (tenant.status && tenant.status !== "active") throw new AppError("Tenant account is inactive", 403);

  const license = await License.findOne({
    where: { client_id: tenant.id, status: "active" },
    order: [["issued_at", "DESC"]],
  });
  if (license?.expiresAt) {
    const graceDays = license.gracePeriodDays || 7;
    const cutoff = new Date(license.expiresAt);
    cutoff.setDate(cutoff.getDate() + graceDays);
    if (new Date() > cutoff) throw new AppError("License expired", 403);
  }

  // Role name intentionally equals the database name: the server's pg_hba
  // uses a "samerole" rule, so each tenant role can only reach its own DB.
  const dbName = `erp_t${tenant.id}`;
  const roleName = dbName;
  const rolePassword = tenantDbPassword(dbName);

  // Provision with the server's own DB credentials (role needs CREATEDB + CREATEROLE)
  const admin = new PgClient({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    // Use our own DB, not "postgres" — pg_hba only lets merix reach merixdb
    database: process.env.DB_NAME,
    connectionTimeoutMillis: 8000,
    ...(process.env.DB_HOST !== "127.0.0.1" && process.env.DB_HOST !== "localhost"
      ? { ssl: { rejectUnauthorized: false } }
      : {}),
  });

  try {
    await admin.connect();

    const roleExists = await admin.query("SELECT 1 FROM pg_roles WHERE rolname = $1", [roleName]);
    if (roleExists.rows.length === 0) {
      await admin.query(`CREATE ROLE "${roleName}" LOGIN PASSWORD ${quoteLiteral(rolePassword)}`);
    } else {
      // Keep password in sync with the derivation secret
      await admin.query(`ALTER ROLE "${roleName}" WITH LOGIN PASSWORD ${quoteLiteral(rolePassword)}`);
    }

    // PG16: creating a DB owned by another role requires SET ROLE membership
    await admin.query(`GRANT "${roleName}" TO CURRENT_USER`);

    const dbExists = await admin.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
    if (dbExists.rows.length === 0) {
      await admin.query(`CREATE DATABASE "${dbName}" OWNER "${roleName}"`);
      console.log(`[remote-db] created ${dbName} for tenant ${tenant.id} (${tenant.name})`);
    }

    // Tenant isolation: only the tenant's own role may connect
    await admin.query(`REVOKE CONNECT ON DATABASE "${dbName}" FROM PUBLIC`);
    await admin.query(`GRANT CONNECT ON DATABASE "${dbName}" TO "${roleName}"`);
  } finally {
    await admin.end().catch(() => {});
  }

  await device.update({ lastSeenAt: new Date() });

  return {
    db: {
      host: PUBLIC_DB_HOST,
      port: PUBLIC_DB_PORT,
      user: roleName,
      password: rolePassword,
      database: dbName,
      ssl: true,
    },
    tenantId: tenant.id,
  };
};
