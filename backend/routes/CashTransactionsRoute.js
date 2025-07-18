const express = require("express");
const router = express.Router();
const { CashTransactions, Sequelize, Sales } = require("../models");

// GetAll Transactions
function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  const hour = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year} ${hour}:${min}`;
}
router.get("/", async (req, res) => {
  try {
    // Bugünün başlangıcı ve bitişi
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Bugünkü işlemleri çek
    const transactions = await CashTransactions.findAll({
      where: {
        date: {
          [Sequelize.Op.gte]: todayStart,
          [Sequelize.Op.lte]: todayEnd,
        },
      },
      order: [["date", "DESC"]],
    });

    // Toplam gelir ve gideri tek döngüde hesapla
    let todayIncome = 0;
    let todayExpense = 0;

    const formatted = transactions.map((t) => {
      if (t.transactionType === "in") {
        todayIncome += parseFloat(t.amount);
      } else if (t.transactionType === "out") {
        todayExpense += parseFloat(t.amount);
      }
      const amount =
        t.transactionType === "out"
          ? `- ${parseFloat(t.amount).toFixed(2)}`
          : `+ ${parseFloat(t.amount).toFixed(2)}`;
      return {
        ...t.toJSON(),
        date: formatDate(t.date),
        amount,
      };
    });

    // Günlük ciroyu Sales tablosundan hesapla
    const dailySales = await Sales.findAll({
      where: {
        date: {
          [Sequelize.Op.gte]: todayStart,
          [Sequelize.Op.lte]: todayEnd,
        },
      },
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("total_amount")), "dailyRevenue"],
      ],
      raw: true,
    });

    const dailyRevenue = dailySales[0]?.dailyRevenue
      ? parseFloat(dailySales[0].dailyRevenue).toFixed(2)
      : "0.00";

  res.json({
  transactions: formatted,
  todayIncome: `${todayIncome.toFixed(2)} ₼`,
  todayExpense: `- ${todayExpense.toFixed(2)} ₼`,
  todayTotal: `${(todayIncome - todayExpense + parseFloat(dailyRevenue)).toFixed(2)} ₼`,
  dailyRevenue: `${dailyRevenue} ₼`,
});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Create
router.post("/create-transaction", async (req, res) => {
  try {
    const { date, transactionType, amount, description, paymentMethod } =
      req.body;

    if (!transactionType || !amount || !paymentMethod) {
      return res.status(400).json({
        error: "transactionType, amount ve paymentMethod zorunludur.",
      });
    }

    const transaction = await CashTransactions.create({
      date: date || new Date(),
      transactionType,
      amount,
      description,
      paymentMethod,
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { date, transactionType, amount, description, paymentMethod } =
    req.body;
  try {
    const transaction = await CashTransactions.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    transaction.date = date || transaction.date;
    transaction.transactionType =
      transactionType || transaction.transactionType;
    transaction.amount = amount || transaction.amount;
    transaction.description = description || transaction.description;
    transaction.paymentMethod = paymentMethod || transaction.paymentMethod;

    await transaction.save();
    res.json(transaction);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await CashTransactions.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    await transaction.destroy();
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
