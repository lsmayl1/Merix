import express from "express";
import {
  CreateSale,
  GetSalesByUserId,
} from "../../services/sales/SaleService.js";
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const sale = await CreateSale(req.body, req.body.userId);

    res.status(201).json({
      status: "success",
      data: sale,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/user/sales", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const sales = await GetSalesByUserId(userId);
    res.status(200).json({
      status: "success",
      ...sales,
    });
  } catch (error) {
    next(error);
  }
});

export { router };
