const express = require("express");
const router = express.Router();
const {
  Sales,
  SalesDetails,
  Products,
  sequelize,
  Sequelize,
  Op,
} = require("../models");

router.post("/sale", async (req, res) => {
  const { from, to } = req.body;

  try {
    // Tüm satışları ve detaylarını çek
    const sales = await Sales.findAll({
      where: {
        date: {
          [Op.between]: [from, to],
        },
      },
      include: [
        {
          model: SalesDetails,
          as: "details",
          attributes: ["sell_price", "buy_price", "quantity"],
        },
      ],
    });

    let totalRevenue = 0;
    let totalProfit = 0;
    let totalSales = sales.length; // Satış sayısı

    sales.forEach((sale) => {
      if (Array.isArray(sale.details)) {
        sale.details.forEach((detail) => {
          const revenue = Number(detail.sell_price) * Number(detail.quantity);
          let profit = 0;
          if (Number(detail.buy_price) !== 0) {
            profit =
              (Number(detail.sell_price) - Number(detail.buy_price)) *
              Number(detail.quantity);
          }
          totalRevenue += revenue;
          totalProfit += profit;
        });
      }
    });

    const profitMargin =
      totalRevenue > 0 && totalProfit > 0
        ? ((totalProfit / totalRevenue) * 100).toFixed(2) + " %"
        : "0 %";

    res.json({
      totalRevenue: totalRevenue.toFixed(2) + " ₼",
      totalSales,
      totalProfit: totalProfit.toFixed(2) + " ₼",
      profitMargin,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Products.findAll();

    // Sayılar yoksa 0, varsa binlik ayraçlı string olarak döndürülür
    const totalProducts = products?.length || 0;
    const kgBasedProducts =
      products?.filter((p) => p.unit === "kg").length || 0;
    const pieceBasedProducts =
      products?.filter((p) => p.unit === "piece").length || 0;
    const zeroOrNegativeStock =
      products?.filter((p) => Number(p.stock) <= 0).length || 0;

    res.json({
      totalProducts: totalProducts.toLocaleString("tr-TR"),
      kgBasedProducts: kgBasedProducts.toLocaleString("tr-TR"),
      pieceBasedProducts: pieceBasedProducts.toLocaleString("tr-TR"),
      zeroOrNegativeStock: zeroOrNegativeStock.toLocaleString("tr-TR"),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/products-sold", async (req, res) => {
  const { from, to } = req.body;

  try {
    // İlgili tarihlerdeki satış detaylarını çek
    const sales = await Sales.findAll({
      where: {
        date: {
          [Op.between]: [from, to],
        },
      },
      include: [
        {
          model: SalesDetails,
          as: "details",
          attributes: ["buy_price", "quantity"],
        },
      ],
    });

    let quantitySold = 0;
    let totalStockCost = 0;

    sales.forEach((sale) => {
      if (Array.isArray(sale.details)) {
        sale.details.forEach((detail) => {
          const qty = Number(detail.quantity) || 0;
          const buyPrice = Number(detail.buy_price) || 0;
          quantitySold += qty;
          totalStockCost += buyPrice * qty;
        });
      }
    });

    res.json({
      quantitySold: quantitySold.toLocaleString("tr-TR"),
      totalStockCost: totalStockCost.toFixed(2) + " ₼",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/dashboard", async (req, res) => {
  const { from, to } = req.body;

  try {
    // Tüm satışları ve detaylarını çek
    const sales = await Sales.findAll({
      where: {
        date: {
          [Op.between]: [from, to],
        },
      },
      include: [
        {
          model: SalesDetails,
          as: "details",
          attributes: ["sell_price", "buy_price", "quantity"],
        },
      ],
    });

    let totalRevenue = 0;
    let totalProfit = 0;
    let totalSales = sales.length; // Satış sayısı

    sales.forEach((sale) => {
      if (Array.isArray(sale.details)) {
        sale.details.forEach((detail) => {
          const revenue = Number(detail.sell_price) * Number(detail.quantity);
          let profit = 0;
          if (Number(detail.buy_price) !== 0) {
            profit =
              (Number(detail.sell_price) - Number(detail.buy_price)) *
              Number(detail.quantity);
          }
          totalRevenue += revenue;
          totalProfit += profit;
        });
      }
    });

    // Tüm ürünlerin toplam stok maliyeti (Products tablosundan)
    const products = await Products.findAll({
      attributes: ["buyPrice", "stock"],
    });
    let totalStockCost = 0;
    products.forEach((product) => {
      totalStockCost += Number(product.buyPrice) * Number(product.stock);
    });

    res.json({
      totalRevenue: totalRevenue.toFixed(2) + " ₼",
      totalSales,
      totalProfit: totalProfit.toFixed(2) + " ₼",
      totalStockCost: totalStockCost.toFixed(2) + " ₼",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/daily-revenue", async (req, res) => {
  try {
    const sales = await Sales.findAll();

    // Günlük toplamları hesaplamak için bir nesne
    const dailyTotals = {};

    sales.forEach((sale) => {
      // Tarihi "YYYY-MM-DD" formatına çevir
      const dateObj = new Date(sale.date);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      if (!dailyTotals[formattedDate]) {
        dailyTotals[formattedDate] = 0;
      }
      dailyTotals[formattedDate] += Number(sale.total_amount || 0);
    });

    // Sonucu istenen array formatına çevir
    const result = Object.entries(dailyTotals).map(([date, revenue]) => ({
      date,
      revenue: Number(revenue.toFixed(2)),
    }));

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/hourly-revenue", async (req, res) => {
  try {
    const sales = await Sales.findAll();

    // Saatlik toplamları hesaplamak için bir nesne
    const hourlyTotals = {};

    sales.forEach((sale) => {
      const dateObj = new Date(sale.date);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const hour = String(dateObj.getHours()).padStart(2, "0");
      // "YYYY-MM-DD HH" formatı
      const formattedHour = `${day} ${hour}:00`;

      if (!hourlyTotals[formattedHour]) {
        hourlyTotals[formattedHour] = 0;
      }
      hourlyTotals[formattedHour] += Number(sale.total_amount || 0);
    });

    // Sonucu array of object olarak döndür
    const result = Object.entries(hourlyTotals).map(([date, revenue]) => ({
      date,
      revenue: Number(revenue.toFixed(2)),
    }));

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/bestSellers", async (req, res) => {
  try {
    // En çok satılan 20 ürünü bul
    const bestSellers = await SalesDetails.findAll({
      attributes: [
        "product_id",
        [sequelize.fn("SUM", sequelize.col("SalesDetails.quantity")), "sold"],
      ],
      group: [
        "SalesDetails.product_id",
        "product.product_id",
        "product.name",
        "product.barcode",
        "product.stock",
      ],
      order: [[sequelize.literal("sold"), "DESC"]],
      limit: 20,
      include: [
        {
          model: Products,
          as: "product",
          attributes: ["product_id", "name", "barcode", "stock"],
        },
      ],
      raw: true,
      nest: true,
    });

    // Kalan ürünleri bul (bestSeller olmayanlar)
    const bestSellerIds = bestSellers.map((item) => item.product_id);

    const restProducts = await Products.findAll({
      where: {
        product_id: { [Op.notIn]: bestSellerIds },
      },
      order: [["stock", "ASC"]],
      limit: 20,
      attributes: ["product_id", "name", "barcode", "stock"],
      raw: true,
    });

    // restProducts'a sold alanı ekle (0 olarak)
    const restProductsWithSold = restProducts.map((item) => ({
      ...item,
      sold: 0,
    }));

    // Sonuçları birleştir
    const result = [
      ...bestSellers.map((item) => ({
        product_id: item.product_id,
        name: item.product.name,
        barcode: item.product.barcode,
        sold: Number(item.sold),
        stock: item.product.stock,
      })),
      ...restProductsWithSold,
    ];

    // Tümünü tekrar stok miktarına göre azdan çoğa sırala
    result.sort((a, b) => a.stock - b.stock);

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
