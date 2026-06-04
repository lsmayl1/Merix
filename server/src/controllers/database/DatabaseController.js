import express from "express";
import sequelize from "../../config/index.js";

const router = express.Router();

// GET /api/database/tables
router.get("/tables", async (req, res, next) => {
  try {
    const [tables] = await sequelize.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    const result = await Promise.all(
      tables.map(async ({ table_name }) => {
        const [columns] = await sequelize.query(`
          SELECT column_name, data_type, is_nullable, column_default, character_maximum_length
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = :table
          ORDER BY ordinal_position
        `, { replacements: { table: table_name } });

        const [countRows] = await sequelize.query(
          `SELECT COUNT(*) AS count FROM "${table_name}"`
        );

        return { name: table_name, rowCount: parseInt(countRows[0].count), columns };
      })
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/database/tables/:name — paginated row preview
router.get("/tables/:name", async (req, res, next) => {
  try {
    const { name } = req.params;
    const limit  = Math.min(parseInt(req.query.limit)  || 50, 500);
    const offset = parseInt(req.query.offset) || 0;

    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      return res.status(400).json({ error: "Invalid table name" });
    }

    const [rows]        = await sequelize.query(`SELECT * FROM "${name}" LIMIT ${limit} OFFSET ${offset}`);
    const [[{ count }]] = await sequelize.query(`SELECT COUNT(*) AS count FROM "${name}"`);

    res.json({ rows, total: parseInt(count), limit, offset });
  } catch (err) {
    next(err);
  }
});

// POST /api/database/query — run raw SQL
router.post("/query", async (req, res, next) => {
  try {
    const { sql: rawSql } = req.body;
    if (!rawSql?.trim()) return res.status(400).json({ error: "sql is required" });

    const trimmed = rawSql.trim();
    const upper   = trimmed.toUpperCase();

    const isSelect   = upper.startsWith("SELECT") || upper.startsWith("SHOW") || upper.startsWith("EXPLAIN");
    const isDangerous = /DROP\s+DATABASE|DROP\s+SCHEMA|TRUNCATE\s+ALL/i.test(trimmed);

    if (isDangerous) {
      return res.status(403).json({ error: "This operation is not allowed." });
    }

    const start = Date.now();
    const [results, metadata] = await sequelize.query(trimmed);
    const duration = Date.now() - start;

    if (isSelect) {
      res.json({ type: "select", rows: results, rowCount: results.length, duration });
    } else {
      const affected = metadata?.rowCount ?? metadata ?? 0;
      res.json({ type: "write", affected, duration, message: "Query executed successfully" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message || "Query failed" });
  }
});

export { router };
