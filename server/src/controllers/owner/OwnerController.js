import express from "express";
import {
  Client, Sale, User, ErpProduct, ErpCategory, ErpSupplier,
  ErpCustomer, ErpTransaction, ErpStockMovement, SyncRecord, Op,
} from "../../models/index.js";
import { CalculateSale } from "../../services/report/SaleReport.js";
import { DateFormat } from "../../utils/DateFormat.js";

const router = express.Router();

// GET /api/owner/me
router.get("/me", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "firstName", "lastName", "email", "phoneNumber", "role", "clientId"],
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const client = user.clientId
      ? await Client.findByPk(user.clientId, { attributes: ["id", "name", "email", "phone", "status"] })
      : null;

    res.json({ user, client });
  } catch (err) { next(err); }
});

// GET /api/owner/reports
router.get("/reports", async (req, res, next) => {
  try {
    const clientId = req.user.clientId;

    const [sales, products, customers, transactions, categories] = await Promise.all([
      Sale.findAll({ where: { clientId } }),
      ErpProduct.findAll({ where: { clientId } }),
      ErpCustomer.findAll({ where: { clientId } }),
      ErpTransaction.findAll({ where: { clientId } }),
      ErpCategory.findAll({ where: { clientId } }),
    ]);

    const now        = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd   = new Date(todayStart.getTime() + 86400000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const getTs      = (s) => new Date(s.date || s.createdAt).getTime();
    const amt        = (s) => Math.abs(parseFloat(s.total_amount) || 0);

    const saleRows   = sales.filter((s) => s.type !== "return");
    const returnRows = sales.filter((s) => s.type === "return");

    const totalCount   = saleRows.length;
    const totalRevenue = saleRows.reduce((a, s) => a + amt(s), 0);
    const avgOrder     = totalCount > 0 ? totalRevenue / totalCount : 0;

    const todaySales = saleRows.filter((s) => { const t = getTs(s); return t >= todayStart && t < todayEnd; });
    const monthSales = saleRows.filter((s) => getTs(s) >= monthStart.getTime());

    const byPayment = {};
    saleRows.forEach((s) => {
      const m = s.paymentMethod || "cash";
      if (!byPayment[m]) byPayment[m] = { method: m, count: 0, amount: 0 };
      byPayment[m].count++;
      byPayment[m].amount += amt(s);
    });

    const monthlyBuckets = {};
    sales.forEach((s) => {
      const a = amt(s);
      const d = new Date(s.date || s.createdAt);
      const key   = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("en", { month: "short", year: "2-digit" });
      if (!monthlyBuckets[key]) monthlyBuckets[key] = { month: label, revenue: 0, orders: 0 };
      if (s.type === "return") { monthlyBuckets[key].revenue -= a; }
      else { monthlyBuckets[key].revenue += a; monthlyBuckets[key].orders += 1; }
    });
    const monthly = Object.entries(monthlyBuckets)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => ({ ...v, revenue: Math.max(0, parseFloat(v.revenue.toFixed(2))) }));

    const byCashier = {};
    saleRows.forEach((s) => {
      const uid = s.userId || "unknown";
      if (!byCashier[uid]) byCashier[uid] = { userId: uid, count: 0, revenue: 0 };
      byCashier[uid].count++;
      byCashier[uid].revenue += amt(s);
    });
    const cashierIds = Object.keys(byCashier).filter((id) => id !== "unknown");
    const cashierUsers = cashierIds.length
      ? await User.findAll({ where: { id: cashierIds }, attributes: ["id", "firstName", "lastName"] })
      : [];
    const cashierNameMap = {};
    cashierUsers.forEach((u) => { cashierNameMap[u.id] = `${u.firstName} ${u.lastName}`; });
    const byCashierArr = Object.values(byCashier)
      .map((c) => ({ ...c, name: cashierNameMap[c.userId] || "Unknown", revenue: parseFloat(c.revenue.toFixed(2)) }))
      .sort((a, b) => b.revenue - a.revenue);

    const LOW_STOCK     = 5;
    const activeProducts = products.filter((p) => p.isActive !== false);
    const totalValue     = products.reduce((a, p) => a + parseFloat(p.stock || 0) * parseFloat(p.price || 0), 0);
    const catMap = {};
    categories.forEach((c) => { catMap[c.id] = c.name; });
    const byCategory = {};
    products.forEach((p) => {
      const cat = catMap[p.categoryId] || "Uncategorized";
      if (!byCategory[cat]) byCategory[cat] = { name: cat, count: 0, value: 0 };
      byCategory[cat].count++;
      byCategory[cat].value += parseFloat(p.stock || 0) * parseFloat(p.price || 0);
    });

    const totalDebt  = customers.reduce((a, c) => a + Math.max(0, parseFloat(c.balance || 0)), 0);
    const debtors    = customers.filter((c) => parseFloat(c.balance || 0) > 0).length;
    const topDebtors = customers
      .filter((c) => parseFloat(c.balance || 0) > 0)
      .sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance))
      .slice(0, 10)
      .map((c) => ({ name: c.name, phone: c.phone, balance: parseFloat(parseFloat(c.balance).toFixed(2)) }));

    const income   = transactions.filter((t) => t.type === "income").reduce((a, t) => a + parseFloat(t.amount || 0), 0);
    const expenses = transactions.filter((t) => t.type === "expense").reduce((a, t) => a + parseFloat(t.amount || 0), 0);

    res.json({
      sales: {
        total:           { count: totalCount, revenue: parseFloat(totalRevenue.toFixed(2)), avgOrder: parseFloat(avgOrder.toFixed(2)) },
        today:           { count: todaySales.length, revenue: parseFloat(todaySales.reduce((a, s) => a + amt(s), 0).toFixed(2)) },
        thisMonth:       { count: monthSales.length, revenue: parseFloat(monthSales.reduce((a, s) => a + amt(s), 0).toFixed(2)) },
        returns:         { count: returnRows.length },
        byPaymentMethod: Object.values(byPayment).map((p) => ({ ...p, amount: parseFloat(p.amount.toFixed(2)) })),
        monthly,
        byCashier:       byCashierArr,
      },
      inventory: {
        total:      { count: activeProducts.length, totalValue: parseFloat(totalValue.toFixed(2)) },
        lowStock:   activeProducts.filter((p) => parseFloat(p.stock || 0) > 0 && parseFloat(p.stock || 0) <= LOW_STOCK)
                      .map((p) => ({ id: p.id, name: p.name, stock: parseFloat(p.stock || 0), unit: p.unit, price: parseFloat(p.price || 0) })),
        outOfStock: activeProducts.filter((p) => parseFloat(p.stock || 0) <= 0).map((p) => ({ id: p.id, name: p.name })),
        byCategory: Object.values(byCategory).map((c) => ({ ...c, value: parseFloat(c.value.toFixed(2)) })).sort((a, b) => b.value - a.value),
      },
      customers: {
        total: customers.length, debtors,
        totalDebt: parseFloat(totalDebt.toFixed(2)),
        topDebtors,
      },
      financial: {
        income:    parseFloat(income.toFixed(2)),
        expenses:  parseFloat(expenses.toFixed(2)),
        netProfit: parseFloat((income - expenses).toFixed(2)),
      },
    });
  } catch (err) { next(err); }
});

// GET /api/owner/sales
router.get("/sales", async (req, res, next) => {
  try {
    const { page = 1, limit = 20, from, to } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = { clientId: req.user.clientId };
    if (from && to) where.createdAt = { [Op.between]: [new Date(from), new Date(to)] };

    const { count, rows } = await Sale.findAndCountAll({
      where, order: [["createdAt", "DESC"]], limit: parseInt(limit), offset,
    });

    res.json({
      total: count,
      pageCount: Math.ceil(count / parseInt(limit)),
      sales: rows.map((s) => ({
        id:               s.id,
        total_amount:     parseFloat(s.total_amount)      || 0,
        subtotal_amount:  parseFloat(s.subtotal_amount)   || 0,
        discount:         parseFloat(s.discount)          || 0,
        discounted_amount: parseFloat(s.discounted_amount) || 0,
        paymentMethod:    s.paymentMethod,
        type:             s.type,
        date:             DateFormat(s.date || s.createdAt),
      })),
    });
  } catch (err) { next(err); }
});

// GET /api/owner/products
router.get("/products", async (req, res, next) => {
  try {
    const rows = await ErpProduct.findAll({
      where: { clientId: req.user.clientId },
      order: [["syncedAt", "DESC"]],
    });
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/owner/transactions
router.get("/transactions", async (req, res, next) => {
  try {
    const rows = await ErpTransaction.findAll({
      where: { clientId: req.user.clientId },
      order: [["syncedAt", "DESC"]],
    });
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/owner/customers
router.get("/customers", async (req, res, next) => {
  try {
    const rows = await ErpCustomer.findAll({
      where: { clientId: req.user.clientId },
      order: [["syncedAt", "DESC"]],
    });
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/owner/suppliers
router.get("/suppliers", async (req, res, next) => {
  try {
    const rows = await ErpSupplier.findAll({
      where: { clientId: req.user.clientId },
      order: [["syncedAt", "DESC"]],
    });
    res.json(rows);
  } catch (err) { next(err); }
});

export { router };
