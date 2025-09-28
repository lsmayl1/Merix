import express from "express";
import { CreateSale } from "../../services/sales/SaleService.js";
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const sale = await CreateSale(req.body, userId);

    res.status(201).json({
      status: "success",
      data: sale,
    });
  } catch (error) {
    next(error);
  }
});

export { router };
