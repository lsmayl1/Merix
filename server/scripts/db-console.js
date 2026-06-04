#!/usr/bin/env node
/**
 * Local database console
 * Usage:
 *   node scripts/db-console.js                          → interactive REPL
 *   node scripts/db-console.js "SELECT * FROM users"    → run one query and exit
 *   node scripts/db-console.js --file ./my-script.sql   → run a .sql file and exit
 */

import { Sequelize } from "sequelize";
import readline from "readline";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host:    process.env.DB_HOST     || "localhost",
    port:    process.env.DB_PORT     || 5432,
    dialect: "postgres",
    logging: false,
  }
);

/* ── helpers ── */
function printTable(rows) {
  if (!rows.length) { console.log("(0 rows)"); return; }
  const cols = Object.keys(rows[0]);
  const widths = cols.map((c) =>
    Math.max(c.length, ...rows.map((r) => String(r[c] ?? "null").length))
  );
  const sep = "+" + widths.map((w) => "-".repeat(w + 2)).join("+") + "+";
  const row = (cells) => "| " + cells.map((c, i) => String(c ?? "null").padEnd(widths[i])).join(" | ") + " |";
  console.log(sep);
  console.log(row(cols));
  console.log(sep);
  rows.forEach((r) => console.log(row(cols.map((c) => r[c]))));
  console.log(sep);
  console.log(`(${rows.length} row${rows.length !== 1 ? "s" : ""})`);
}

async function runSql(sql) {
  const trimmed = sql.trim();
  if (!trimmed) return;

  const upper      = trimmed.toUpperCase();
  const isSelect   = upper.startsWith("SELECT") || upper.startsWith("SHOW") || upper.startsWith("EXPLAIN");
  const isDangerous = /DROP\s+DATABASE|DROP\s+SCHEMA/i.test(trimmed);

  if (isDangerous) {
    console.error("❌  Blocked: DROP DATABASE / DROP SCHEMA is not allowed here.");
    return;
  }

  const start = Date.now();
  try {
    const [results, metadata] = await db.query(trimmed);
    const ms = Date.now() - start;

    if (isSelect) {
      printTable(results);
      console.log(`✅  ${results.length} row(s)  —  ${ms}ms\n`);
    } else {
      const affected = metadata?.rowCount ?? 0;
      console.log(`✅  Query OK  —  ${affected} row(s) affected  —  ${ms}ms\n`);
    }
  } catch (err) {
    console.error(`❌  Error: ${err.message}\n`);
  }
}

async function runFile(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) { console.error(`File not found: ${abs}`); process.exit(1); }
  const content = fs.readFileSync(abs, "utf-8");
  // Split on semicolons, skip empty
  const statements = content.split(";").map((s) => s.trim()).filter(Boolean);
  for (const stmt of statements) {
    console.log(`\n> ${stmt.slice(0, 80)}${stmt.length > 80 ? "…" : ""}`);
    await runSql(stmt);
  }
}

async function repl() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const prompt = () => rl.question("sql> ", async (line) => {
    const trimmed = line.trim();
    if (trimmed === "\\q" || trimmed === "exit" || trimmed === "quit") {
      console.log("Bye.");
      await db.close();
      rl.close();
      return;
    }
    if (trimmed === "\\dt" || trimmed === "\\tables") {
      await runSql(`
        SELECT table_name,
               (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema='public') AS columns
        FROM information_schema.tables t
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);
    } else if (trimmed.startsWith("\\d ")) {
      const tbl = trimmed.slice(3).trim();
      await runSql(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = '${tbl}'
        ORDER BY ordinal_position
      `);
    } else if (trimmed === "\\help" || trimmed === "?") {
      console.log(`
  Commands:
    \\dt  or  \\tables      — list all tables
    \\d <table>            — describe a table
    \\q  /  exit  /  quit  — exit
    Any SQL statement     — executed directly
  `);
    } else if (trimmed) {
      await runSql(trimmed);
    }
    prompt();
  });

  rl.on("close", async () => { await db.close(); });
  console.log(`\n🗄  DB Console  —  ${process.env.DB_HOST || "localhost"}/${process.env.DB_NAME}`);
  console.log(`   Type \\help for commands, \\q to quit\n`);
  prompt();
}

/* ── entry point ── */
(async () => {
  try {
    await db.authenticate();
  } catch (err) {
    console.error("❌  Cannot connect to database:", err.message);
    process.exit(1);
  }

  const args = process.argv.slice(2);

  if (args[0] === "--file" && args[1]) {
    await runFile(args[1]);
    await db.close();
  } else if (args[0] && !args[0].startsWith("-")) {
    await runSql(args[0]);
    await db.close();
  } else {
    await repl();
  }
})();
