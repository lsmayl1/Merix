const express = require("express");
const router = express.Router();

const { Suppliers, SupplierTransactions } = require("../../models/index");

router.get("/", async (req, res) => {
  try {
    const transactions = await SupplierTransactions.findAll({
      include: [
        {
          model: Suppliers,
          as: "supplier",
          attributes: ["name", "phone"],
        },
      ],
    });
    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found" });
    }
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching supplier transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const transactions = await SupplierTransactions.findAll({
      where: { supplier_id: id }, // burada supplier_id ile filtreleniyor
      include: [
        {
          model: Suppliers,
          as: "supplier",
          attributes: ["name", "phone"],
        },
      ],
    });

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found for this supplier" });
    }

    let totalAmount = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "payment") {
        transaction.amount = -transaction.amount; // Ödeme işlemleri için miktarı negatif yapıyoruz
      } else if (transaction.type === "purchase") {
        transaction.amount = transaction.amount; // Alım işlemleri için miktarı pozitif yapıyoruz
      }
      totalAmount += parseFloat(transaction.amount);
    });

    res.status(200).json({
      transactions,
      totalAmount: totalAmount.toFixed(2) + " ₼", // Toplam miktarı iki ondalık basamakla döndürüyoruz
    });
  } catch (error) {
    console.error("Error fetching supplier transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const { supplier_id, amount, date, payment_method, type } = req.body;
  try {
    if (!supplier_id || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newTransaction = await SupplierTransactions.create({
      supplier_id,
      amount,
      date,
      payment_method,
      type,
    });
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error creating supplier transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
