const {
  Sales,
  SalesDetails,
  Products,
  sequelize,
  Sequelize,
} = require("../models");
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
      saleId: sale.sa,
      totalAmount: sale.total_amount,
      paymentMethod: sale.payment_method,
      date: sale.date,
      details: sale.details.map((detail) => ({
        quantity: detail.quantity,
        subtotal: detail.subtotal,
        product: {
          id: detail.product.id,
          name: detail.product.name,
          barcode: detail.product.barcode,
          sellPrice: detail.product.sellPrice,
        },
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    res.json({ error: "Server Xetasi" + error });
  }
});
// 🔹 POST /sales
router.post("/", async (req, res) => {
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
      if (!item.product_id || !item.quantity) {
        return res.status(400).json({
          error: "Each product must have product_id and quantity",
        });
      }
      if (item.quantity < 1) {
        return res.status(400).json({ error: "Quantity must be at least 1" });
      }

      const product = await Products.findByPk(item.product_id);
      if (!product) {
        return res.status(404).json({
          error: `Product with id ${item.product_id} not found`,
        });
      }

      console.log(`Product ${item.product_id}:`, {
        buyPrice: product.buyPrice,
        sellPrice: product.sellPrice,
        stock: product.stock,
      });

      const subtotal = product.sellPrice * item.quantity;
      totalAmount += subtotal;

      salesDetails.push({
        product_id: item.product_id,
        product_name: product.name,
        quantity: item.quantity,
        subtotal,
        buy_price: product.buyPrice,
        sell_price: product.sellPrice,
        previous_stock: product.stock,
        new_stock: product.stock - item.quantity,
      });

      stockUpdates.push({
        product,
        quantity: item.quantity,
      });
    }

    console.log("SalesDetails to create:", salesDetails); // Debug before transaction

    const result = await sequelize.transaction(async (t) => {
      try {
        const sale = await Sales.create(
          {
            total_amount: totalAmount,
            payment_method,
          },
          { transaction: t }
        );
        console.log("Created sale:", sale.toJSON());

        await Promise.all(
          salesDetails.map(async (detail) => {
            try {
              const createdDetail = await SalesDetails.create(
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
              console.log("Created SalesDetail:", createdDetail.toJSON());
            } catch (detailError) {
              console.error("SalesDetails create error:", detailError);
              throw detailError; // Re-throw to rollback transaction
            }
          })
        );

        await Promise.all(
          stockUpdates.map(async (update) => {
            try {
              await update.product.update(
                {
                  stock: sequelize.literal(`stock - ${update.quantity}`),
                },
                { transaction: t }
              );
              console.log(`Updated stock for product ${update.product.id}`);
            } catch (updateError) {
              console.error("Stock update error:", updateError);
              throw updateError; // Re-throw to rollback transaction
            }
          })
        );

        return sale;
      } catch (transactionError) {
        console.error("Transaction inner error:", transactionError);
        throw transactionError; // Ensure rollback and outer catch
      }
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
