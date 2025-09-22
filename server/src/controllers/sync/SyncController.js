import express from "express";
import { AppError } from "../../utils/AppError.js";
import { CreateSale } from "../../services/sales/SaleService.js";
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { entity, record_id, action, payload } = req.body;
    console.log(entity);
    if (!entity || !record_id || !action) {
      throw new AppError(
        "entity, record_id and action are required fields",
        400
      );
    }
    if (entity === "sale" && action === "create") {
      await CreateSale({
        id: record_id,
        amount: payload.totalAmount,
        paymentMethod: payload.payment_method,
        type: payload.type,
        date: payload.date,
      });
    }
    res.status(200).json({ success: true, message: "Sync processed" });
  } catch (err) {
    next(err);
  }
});

export { router };
