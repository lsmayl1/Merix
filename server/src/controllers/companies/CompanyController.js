import express from "express";
import { Company, Client } from "../../models/index.js";

const router = express.Router();

// GET /api/companies — all companies across all clients
router.get("/", async (req, res, next) => {
  try {
    const companies = await Company.findAll({
      include: [{ model: Client, as: "client", attributes: ["id", "name", "status"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(companies);
  } catch (err) {
    next(err);
  }
});

// GET /api/companies/:id
router.get("/:id", async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.params.id, {
      include: [{ model: Client, as: "client", attributes: ["id", "name", "status"] }],
    });
    if (!company) return res.status(404).json({ error: "Company not found" });
    res.json(company);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/companies/:id — update company info
router.patch("/:id", async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ error: "Company not found" });
    const { name, email, phone, address, is_active } = req.body;
    await company.update({ name, email, phone, address, is_active });
    res.json(company);
  } catch (err) {
    next(err);
  }
});

export { router };
