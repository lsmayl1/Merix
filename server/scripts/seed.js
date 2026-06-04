/**
 * Merix Admin — seed script
 * Usage:  node scripts/seed.js [--force]
 *
 * Creates a Client, an admin User, and a 1-year License.
 * --force  skips the "already seeded" guard and re-seeds.
 */

import dotenv from "dotenv";
dotenv.config();

import readline from "readline";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import sequelize from "../src/config/index.js";
import { Client, User, License } from "../src/models/index.js";

const force = process.argv.includes("--force");

// ── tiny prompt helper ─────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q, fallback = "") =>
  new Promise((res) =>
    rl.question(fallback ? `${q} [${fallback}]: ` : `${q}: `, (a) =>
      res(a.trim() || fallback),
    ),
  );

// ── main ───────────────────────────────────────────────────────────────────
async function seed() {
  console.log("\n=== Merix Admin — Database Seed ===\n");

  await sequelize.sync();

  // Guard — skip if data already exists unless --force
  if (!force) {
    const existing = await Client.count();
    if (existing > 0) {
      console.log(
        `Database already has ${existing} client(s). Run with --force to re-seed.\n`,
      );
      process.exit(0);
    }
  }

  // ── Collect input ──────────────────────────────────────────────────────
  console.log("Client / company details:");
  const clientName  = await ask("  Company name", "Demo Company");
  const clientEmail = await ask("  Company email", "info@demo.com");
  const clientPhone = await ask("  Company phone", "+994000000000");

  console.log("\nAdmin user:");
  const firstName   = await ask("  First name", "Admin");
  const lastName    = await ask("  Last name", "User");
  const email       = await ask("  Email", "admin@demo.com");
  const phone       = await ask("  Phone", "+994000000001");
  const password    = await ask("  Password (min 6 chars)", "admin123");

  console.log("\nLicense:");
  const licenseType = await ask("  Type  (trial / monthly / yearly / lifetime)", "yearly");
  const expMonths   = licenseType === "lifetime" ? null : parseInt(await ask("  Expire in months", "12"), 10);

  rl.close();

  // ── Validate ───────────────────────────────────────────────────────────
  if (password.length < 6) { console.error("Password must be at least 6 characters."); process.exit(1); }
  const validTypes = ["trial", "monthly", "yearly", "lifetime"];
  if (!validTypes.includes(licenseType)) { console.error(`License type must be one of: ${validTypes.join(", ")}`); process.exit(1); }

  // ── Create ─────────────────────────────────────────────────────────────
  const t = await sequelize.transaction();
  try {
    // Client
    const client = await Client.create(
      { name: clientName, email: clientEmail, phone: clientPhone, status: "active" },
      { transaction: t },
    );
    console.log(`\n[✓] Client created  id=${client.id}`);

    // User
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create(
      {
        firstName,
        lastName,
        email,
        phoneNumber: phone,
        password:    hash,
        clientId:    client.id,
        role:        "admin",
        status:      "active",
        permissions: [],
      },
      { transaction: t },
    );
    console.log(`[✓] Admin user created  id=${user.id}  email=${user.email}`);

    // License
    const now       = new Date();
    const expiresAt = expMonths
      ? new Date(now.getFullYear(), now.getMonth() + expMonths, now.getDate())
      : null;

    const license = await License.create(
      {
        clientId:       client.id,
        licenseKey:     `LIC-${randomUUID().toUpperCase().slice(0, 16)}`,
        type:           licenseType,
        status:         "active",
        maxDevices:     5,
        features:       [],
        gracePeriodDays: 7,
        issuedAt:       now,
        activatedAt:    now,
        expiresAt,
      },
      { transaction: t },
    );
    console.log(`[✓] License created  key=${license.licenseKey}  expires=${expiresAt ? expiresAt.toISOString().slice(0, 10) : "never"}`);

    await t.commit();

    console.log("\n=== Seed complete ===");
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role:     admin\n`);
  } catch (err) {
    await t.rollback();
    console.error("\n[!] Seed failed:", err.message);
    process.exit(1);
  }

  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
