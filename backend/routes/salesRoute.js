const moment = require("moment");
const {
  Sales,
  SalesDetails,
  Products,
  sequelize,
  Sequelize,
  Op,
} = require("../models");
const express = require("express");
const router = express.Router();
// Get all sales
router.post("/", async (req, res) => {
  const { from, to } = req.body;
  // Parse the from date explicitly
  const fromDate = new Date(from);
  let toDate = to ? new Date(to) : new Date(from);
  if (!to) toDate.setHours(23, 59, 59, 999); // Set to 23:59:59.999 of the same day

  // Validate dates
  const isValidDate = (date) => date instanceof Date && !isNaN(date);
  if (!isValidDate(fromDate) || !isValidDate(toDate)) {
    return res.status(400).json({ error: "Geçersiz tarih formatı" });
  }
  try {
    const sales = await Sales.findAll({
      where: {
        date: {
          [Op.between]: [fromDate, toDate],
        },
      },
      include: [
        {
          model: SalesDetails,
          as: "details",
          attributes: ["sell_price", "buy_price", "quantity"],
          required: false,
        },
      ],
    });

    const formattedSales = sales.map((sale) => {
      const details = sale.details;
      let profit = 0;
      if (Array.isArray(details)) {
        profit = details.reduce((sum, d) => {
          if (Number(d.buy_price) === 0) return sum;
          return (
            sum +
            (Number(d.sell_price) - Number(d.buy_price)) *
              Number(d.quantity || 0)
          );
        }, 0);
      } else if (details) {
        if (Number(details.buy_price) !== 0) {
          profit =
            (Number(details.sell_price) - Number(details.buy_price)) *
            Number(details.quantity || 0);
        }
      }

      return {
        ...sale.dataValues,
        date: moment(sale.date).tz("Asia/Dubai").format("DD-MM-YYYY HH:mm:ss"),
        profit: Number(profit.toFixed(2)),
      };
    });
    res.json(formattedSales);
  } catch (err) {
    console.log(err);
  }
});
// get by Id

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.json({ error: "Id yoxdur " });
    }
    const sale = await Sales.findByPk(id, {
      include: [
        {
          model: SalesDetails,
          as: "details",
          include: [
            {
              model: Products,
              as: "product",
            },
          ],
        },
      ],
    });
    if (!sale) return res.json({ error: "Satis yoxdur" });

    const response = {
      saleId: sale.sale_id,
      totalAmount: sale.total_amount + " ₼",
      paymentMethod: sale.payment_method,
      date: moment(sale.date).tz("Asia/Dubai").format("DD-MM-YYYY HH:mm:ss"),
      details: sale.details.map((detail) => ({
        quantity: detail.quantity,
        subtotal: detail.subtotal + " ₼",
        id: detail.product.id,
        name: detail.product.name,
        barcode: detail.product.barcode,
        sellPrice: detail.product.sellPrice + " ₼",
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    res.json({ error: "Server Xetasi" + error });
  }
});

router.post("/preview", async (req, res) => {
  const { items } = req.body;
  const resultItems = [];

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Ürün listesi boş." });
  }

  try {
    const grouped = {};

    for (const { barcode, quantity: sentQuantity } of items) {
      let productBarcode = barcode;
      let quantity = sentQuantity || 1;
      let unit = "piece";

      // Tartım barkodu kontrolü
      if (barcode.length === 13 && barcode.startsWith("22")) {
        const kgProduct = await Products.findOne({
          where: { barcode: barcode },
          attributes: ["barcode"],
        });

        if (kgProduct) {
          // Tam barcode varsa, quantity olarak gönderileni kullan
          productBarcode = kgProduct.barcode;
          quantity = sentQuantity || 1;
          unit = "kg";
        } else {
          // Yoksa tartım barkodu olarak işle
          const baseCode = barcode.substring(0, 8);
          const weightGrams = parseInt(barcode.substring(8), 10);
          quantity = weightGrams / 1000; // Kullanıcıdan gelen quantity'yi YOK SAY
          unit = "kg";

          const product = await Products.findOne({
            where: { barcode: { [Op.like]: `${baseCode}%` } },
            attributes: ["barcode"],
          });

          if (!product) continue;
          productBarcode = product.barcode;
        }
      }

      // Aynı ürün daha önce eklenmişse quantity'yi topla
      if (!grouped[productBarcode]) {
        grouped[productBarcode] = {
          productBarcode,
          quantity,
          unit,
        };
      } else {
        grouped[productBarcode].quantity += quantity;
      }
    }

    // 🧮 Hesapla ve response oluştur
    for (const productBarcode in grouped) {
      const { quantity, unit } = grouped[productBarcode];

      const product = await Products.findOne({
        where: { barcode: productBarcode },
        attributes: ["name", "sellPrice", "barcode"],
      });

      if (!product) continue;

      const subtotal = parseFloat(product.sellPrice) * quantity;

      resultItems.push({
        name: product.name,
        barcode: product.barcode, // ✅ sadece ürünün gerçek barkodu
        quantity,
        unit,
        sellPrice: parseFloat(product.sellPrice),
        subtotal,
      });
    }

    const subtotal = resultItems.reduce((sum, i) => sum + i.subtotal, 0);

    res.json({
      subtotal,
      total: subtotal,
      items: resultItems,
    });
  } catch (error) {
    console.error("Preview error:", error.message);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// 🔹 POST /sales
router.post("/create", async (req, res) => {
  try {
    const { products, payment_method } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Products array cannot be empty" });
    }

    const validPaymentMethods = ["cash", "card"];
    if (!validPaymentMethods.includes(payment_method)) {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    let totalAmount = 0;
    const salesDetails = [];
    const stockUpdates = [];

    for (const item of products) {
      let barcode = item.barcode;
      let quantity = item.quantity ?? 1;

      const product = await Products.findOne({ where: { barcode } });

      if (!product) {
        return res.status(404).json({
          error: `Product with barcode ${barcode} not found`,
        });
      }

      if (quantity < 0.001) {
        return res.status(400).json({
          error: `Quantity for barcode ${barcode} must be greater than 0`,
        });
      }

      const subtotal = product.sellPrice * quantity;
      totalAmount += subtotal;

      salesDetails.push({
        product_id: product.product_id,
        product_name: product.name,
        quantity,
        subtotal,
        buy_price: product.buyPrice,
        sell_price: product.sellPrice,
        previous_stock: product.stock,
        new_stock: product.stock - quantity,
      });

      stockUpdates.push({
        product,
        quantity,
      });
    }

    const result = await sequelize.transaction(async (t) => {
      const sale = await Sales.create(
        {
          total_amount: totalAmount,
          payment_method,
        },
        { transaction: t }
      );

      await Promise.all(
        salesDetails.map(async (detail) => {
          await SalesDetails.create(
            {
              sale_id: sale.sale_id,
              product_id: detail.product_id,
              quantity: detail.quantity,
              subtotal: detail.subtotal,
              buy_price: detail.buy_price,
              sell_price: detail.sell_price,
            },
            { transaction: t }
          );
        })
      );

      await Promise.all(
        stockUpdates.map(async (update) => {
          await update.product.update(
            {
              stock: sequelize.literal(`stock - ${update.quantity}`),
            },
            { transaction: t }
          );
        })
      );

      return sale;
    });

    const response = {
      message: "Sale completed successfully",
      sale: {
        ...result.toJSON(),
        salesDetails: salesDetails.map((detail) => ({
          product_name: detail.product_name,
          quantity: detail.quantity,
          subtotal: detail.subtotal,
          buy_price: detail.buy_price,
          sell_price: detail.sell_price,
          stock_change: {
            previous: detail.previous_stock,
            current: detail.new_stock,
          },
        })),
      },
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error("Outer error details:", error);
    return res.status(500).json({
      error: "Failed to complete sale",
      details: error.message,
    });
  }
});

module.exports = router;
