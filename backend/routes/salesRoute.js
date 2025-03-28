const { Sales, SalesDetails, Products } = require("../models");
const express = require("express");
const router = express.Router();
// Get all sales
router.get("/", async (req, res) => {
  try {
    const sales = await Sales.findAll();

    res.json(sales);
  } catch (err) {
    console.log(err);
  }
});

// 🔹 POST /sales
router.post("/", async (req, res) => {
  try {
    const { products, payment_method } = req.body;

    // 🔹 Validasyon: Ürün listesi boş olmamalı
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Products array cannot be empty" });
    }

    // 🔹 Validasyon: Ödeme yöntemi kontrolü
    const validPaymentMethods = ["cash", "card"];
    if (!validPaymentMethods.includes(payment_method)) {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    let totalAmount = 0;
    const salesDetails = [];

    // 🔹 1. Ürünleri kontrol edip subtotal hesaplayalım
    for (const item of products) {
      if (!item.product_id || !item.quantity) {
        return res
          .status(400)
          .json({ error: "Each product must have product_id and quantity" });
      }
      if (item.quantity < 1) {
        return res.status(400).json({ error: "Quantity must be at least 1" });
      }

      // 🔹 Ürünün fiyatını veritabanından çek
      const product = await Products.findByPk(item.product_id);
      if (!product) {
        return res
          .status(404)
          .json({ error: `Product with id ${item.product_id} not found` });
      }

      const subtotal = product.sellPrice * item.quantity;
      totalAmount += subtotal;

      salesDetails.push({
        product_id: item.product_id,
        product_name: product.name,
        quantity: item.quantity,
        subtotal,
        sell_price: product.sellPrice,
      });
    }

    // 🔹 2. Satış oluştur (sale_id otomatik oluşturulur)
    const sale = await Sales.create({
      total_amount: totalAmount,
      payment_method,
    });

    // 🔹 3. Satış detaylarını ekleyelim
    for (const detail of salesDetails) {
      await SalesDetails.create({
        sale_id: sale.sale_id,
        product_id: detail.product_id,
        quantity: detail.quantity,
        subtotal: detail.subtotal,
        sell_price: detail.sell_price,
      });
    }

    // 🔹 4. Satış detaylarını yanıt olarak ekleyelim
    const createdSalesDetails = salesDetails.map((detail) => ({
      product_name: detail.product_name,
      quantity: detail.quantity,
      subtotal: detail.subtotal,
      sell_price: detail.sell_price,
    }));

    return res.status(201).json({
      message: "Sale added successfully",
      sale: {
        ...sale.toJSON(),
        salesDetails: createdSalesDetails,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
