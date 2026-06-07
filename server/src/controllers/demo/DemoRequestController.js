import express from "express";
import { DemoRequest } from "../../models/index.js";
import { authenticate } from "../../middlewares/AuthMiddleware.js";

export const router = express.Router();

// Public — landing page form submission
router.post("/", async (req, res, next) => {
  try {
    const { name, company, phone, email, message } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!phone && !email) return res.status(400).json({ error: "Phone or email is required" });

    const demo = await DemoRequest.create({ name, company, phone, email, message });
    res.status(201).json(demo);
  } catch (err) {
    next(err);
  }
});

// Protected — admin list
router.get("/", authenticate, async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const where = {};
    if (status) where.status = status;

    const offset = (Number(page) - 1) * Number(limit);
    const { rows, count } = await DemoRequest.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset,
    });

    res.json({ data: rows, total: count, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
});

// Protected — update status
router.patch("/:id", authenticate, async (req, res, next) => {
  try {
    const demo = await DemoRequest.findByPk(req.params.id);
    if (!demo) return res.status(404).json({ error: "Not found" });

    const { status } = req.body;
    if (status) await demo.update({ status });
    res.json(demo);
  } catch (err) {
    next(err);
  }
});
