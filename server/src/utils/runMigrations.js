/**
 * Safe column migrations for Merix Admin.
 * Runs on every startup — silently skips already-existing columns.
 */

import { DataTypes } from "sequelize";

const addColumnIfMissing = async (qi, table, column, definition) => {
  try {
    await qi.addColumn(table, column, definition);
    console.log(`[migrate] ✓ ${table}.${column} added`);
  } catch (err) {
    if (err?.parent?.code === "42701" || err?.original?.code === "42701") {
      // column already exists — skip
    } else {
      console.warn(`[migrate] ✗ ${table}.${column}: ${err.message}`);
    }
  }
};

export const runMigrations = async (sequelize) => {
  const qi = sequelize.getQueryInterface();

  /* ── users: add role, status, permissions ── */
  await addColumnIfMissing(qi, "users", "role", {
    type: DataTypes.STRING(32),
    allowNull: true,
    defaultValue: "cashier",
  });
  await addColumnIfMissing(qi, "users", "status", {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: "active",
  });
  await addColumnIfMissing(qi, "users", "permissions", {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  });

  /* ── clients: ensure status column ── */
  await addColumnIfMissing(qi, "clients", "status", {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: "active",
  });

  /* ── sale: add missing columns ── */
  await addColumnIfMissing(qi, "sale", "date", {
    type: DataTypes.DATE,
    allowNull: true,
  });
  await addColumnIfMissing(qi, "sale", "clientId", {
    type: DataTypes.UUID,
    allowNull: true,
  });
  // Allow null on previously NOT NULL columns for ERP sync compatibility
  try {
    await qi.changeColumn("sale", "userId",        { type: DataTypes.UUID,         allowNull: true });
    await qi.changeColumn("sale", "paymentMethod", { type: DataTypes.STRING(32),   allowNull: true });
    await qi.changeColumn("sale", "type",          { type: DataTypes.STRING(16),   allowNull: true });
  } catch { /* already nullable or column doesn't exist yet */ }

  /* ── new ERP sync tables ── */
  const erpTables = [
    "erp_products", "erp_categories", "erp_suppliers",
    "erp_customers", "erp_transactions", "erp_stock_movements",
  ];
  for (const tbl of erpTables) {
    await addColumnIfMissing(qi, tbl, "synced_at", {
      type: DataTypes.DATE, allowNull: true,
    }).catch(() => {}); // table may not exist yet — sequelize.sync() creates it
  }

  console.log("[migrate] done");
};
