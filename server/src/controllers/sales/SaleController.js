import express from "express";
import { CreateSale } from "../../services/sales/SaleService.js";
import { AppError } from "../../utils/AppError.js";
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const sale = await CreateSale(req.body);
    res.status(201).json({
      status: "success",
      data: sale,
    });
  } catch (error) {
    next(error);
  }
});

export { router };
