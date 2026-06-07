import express from "express";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import {
  Client, Sale, User, Company, Op,
  ErpProduct, ErpCategory, ErpSupplier, ErpCustomer,
  ErpTransaction, ErpStockMovement, ClientDevice, License, SyncRecord,
} from "../../models/index.js";
import { CalculateSale } from "../../services/report/SaleReport.js";
import { DateFormat } from "../../utils/DateFormat.js";
import { tenantEntityId } from "../../utils/tenantEntityId.js";

const router = express.Router();

// GET /api/clients
router.get("/", async (req, res, next) => {
  try {
    const clients = await Client.findAll({
      include: [
        { model: User, as: "users", attributes: ["id"] },
        { model: Sale, as: "sales", attributes: ["total_amount", "type", "discounted_amount", "paymentMethod"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    const result = clients.map((client) => {
      const summary = CalculateSale(client.sales);
      return {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        status: client.status,
        createdAt: client.createdAt,
        userCount: client.users.length,
        totalSales: summary.totalSales,
        totalRevenue: summary.totalRevenue.toFixed(2),
      };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/clients — register a new client (simple)
router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (!name) return res.status(400).json({ error: "name is required" });
    const client = await Client.create({ name, email, phone });
    res.status(201).json(client);
  } catch (err) {
    next(err);
  }
});

// GET /api/clients/:id
router.get("/:id", async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id, {
      include: [{ model: User, as: "users", attributes: ["id", "firstName", "lastName", "email", "phoneNumber", "role", "status"] }],
    });
    if (!client) return res.status(404).json({ error: "Client not found" });

    const sales = await Sale.findAll({ where: { clientId: req.params.id } });
    const summary = CalculateSale(sales);

    res.json({
      ...client.toJSON(),
      summary: {
        totalSales: summary.totalSales,
        totalRevenue: summary.totalRevenue.toFixed(2),
        totalCash: summary.totalCash.toFixed(2),
        totalCard: summary.totalCard.toFixed(2),
        returnSales: summary.returnSales,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/clients/:id/users — add a user to an existing client
router.post("/:id/users", async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });

    const { firstName, lastName, email, phoneNumber, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "firstName, lastName, email and password are required" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: "A user with this email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName, lastName, email,
      phoneNumber: phoneNumber || email,
      password: passwordHash,
      clientId: req.params.id,
    });

    res.status(201).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      clientId: user.clientId,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/clients/:id/sales
router.get("/:id/sales", async (req, res, next) => {
  try {
    const { page = 1, limit = 20, from, to } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = { clientId: req.params.id };
    if (from && to) where.createdAt = { [Op.between]: [new Date(from), new Date(to)] };

    const { count, rows } = await Sale.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    const saleIds = rows.map((s) => String(s.id));
    const syncRecords = saleIds.length
      ? await SyncRecord.findAll({
          where: { tenantId: req.params.id, entityType: "sale", entityId: saleIds },
          attributes: ["entityId", "data"],
        })
      : [];
    const returnsMap = {};
    for (const rec of syncRecords) {
      returnsMap[rec.entityId] = Array.isArray(rec.data?.returns) && rec.data.returns.length > 0;
    }

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
        hasReturns:       returnsMap[String(s.id)] || false,
        date:             DateFormat(s.date || s.createdAt),
      })),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/clients/:id/sales/:saleId — full sale detail (items + payments from SyncRecord)
router.get("/:id/sales/:saleId", async (req, res, next) => {
  try {
    const { id, saleId } = req.params;
    const sale = await Sale.findOne({ where: { id: saleId, clientId: id } });
    if (!sale) return res.status(404).json({ error: "Sale not found" });

    const record = await SyncRecord.findOne({
      where: { tenantId: id, entityType: "sale", entityId: String(saleId) },
    });

    const syncData = record?.data || {};

    res.json({
      id:                sale.id,
      total_amount:      parseFloat(sale.total_amount)       || 0,
      subtotal_amount:   parseFloat(sale.subtotal_amount)    || 0,
      discount:          parseFloat(sale.discount)           || 0,
      discounted_amount: parseFloat(sale.discounted_amount)  || 0,
      paymentMethod:     sale.paymentMethod,
      type:              sale.type,
      date:              DateFormat(sale.date || sale.createdAt),
      items:             syncData.items    || syncData.details || [],
      payments:          syncData.payments || [],
      returns:           syncData.returns  || [],
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/clients/:id/users/:userId — update an employee under this company
router.patch("/:id/users/:userId", async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ error: "Company not found" });

    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ error: "Employee not found" });

    const { firstName, lastName, email, phoneNumber, role, status, password } = req.body;
    const updates = {};

    if (firstName)   updates.firstName   = firstName;
    if (lastName)    updates.lastName    = lastName;
    if (phoneNumber) updates.phoneNumber = phoneNumber;
    if (role)        updates.role        = role;
    if (status)      updates.status      = status;
    if (password)    updates.password    = await bcrypt.hash(password, 10);

    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) return res.status(400).json({ error: "A user with this email already exists" });
      updates.email = email;
    }

    await user.update(updates);

    res.json({
      id: user.id, firstName: user.firstName, lastName: user.lastName,
      email: user.email, phoneNumber: user.phoneNumber, role: user.role,
      status: user.status, clientId: user.clientId,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/clients/:id/push-products — Admin pushes product catalog down to ERP
router.post("/:id/push-products", async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });

    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "products array is required" });
    }

    let upserted = 0;
    for (const p of products) {
      if (!p.name) continue;
      const pushKey = p.barcode || p.name;
      const uuid = tenantEntityId(req.params.id, `push:${pushKey}`);
      const row = {
        clientId:   req.params.id,
        name:       p.name,
        price:      p.sellPrice ?? p.price ?? 0,
        barcode:    p.barcode ?? null,
        unit:       p.unit ?? null,
        categoryId: p.category_id ? tenantEntityId(req.params.id, p.category_id) : null,
        stock:      p.stock ?? 0,
        isActive:   p.isActive ?? true,
        rawData:    { ...p, admin_pushed: true },
        syncedAt:   new Date(),
      };
      const existing = await ErpProduct.findByPk(uuid);
      if (existing) {
        await existing.update(row);
      } else {
        await ErpProduct.create({ ...row, id: uuid });
      }
      upserted++;
    }

    res.json({ success: true, pushed: upserted });
  } catch (err) {
    next(err);
  }
});

// GET /api/clients/:id/products
router.get("/:id/products", async (req, res, next) => {
  try {
    const rows = await ErpProduct.findAll({
      where: { clientId: req.params.id },
      order: [["syncedAt", "DESC"]],
    });
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/clients/:id/transactions
router.get("/:id/transactions", async (req, res, next) => {
  try {
    const rows = await ErpTransaction.findAll({
      where: { clientId: req.params.id },
      order: [["syncedAt", "DESC"]],
    });
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/clients/:id/suppliers
router.get("/:id/suppliers", async (req, res, next) => {
  try {
    const rows = await ErpSupplier.findAll({
      where: { clientId: req.params.id },
      order: [["syncedAt", "DESC"]],
    });
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/clients/:id/customers
router.get("/:id/customers", async (req, res, next) => {
  try {
    const rows = await ErpCustomer.findAll({
      where: { clientId: req.params.id },
      order: [["syncedAt", "DESC"]],
    });
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/clients/:id/stock-movements
router.get("/:id/stock-movements", async (req, res, next) => {
  try {
    const rows = await ErpStockMovement.findAll({
      where: { clientId: req.params.id },
      order: [["syncedAt", "DESC"]],
    });
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/clients/:id/devices
router.get("/:id/devices", async (req, res, next) => {
  try {
    const rows = await ClientDevice.findAll({
      where: { clientId: req.params.id },
      order: [["registeredAt", "DESC"]],
    });
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/clients/:id/licenses
router.get("/:id/licenses", async (req, res, next) => {
  try {
    const rows = await License.findAll({
      where: { client_id: req.params.id },
      order: [["issued_at", "DESC"]],
    });
    res.json(rows);
  } catch (err) { next(err); }
});

// POST /api/clients/:id/licenses — issue a new license
router.post("/:id/licenses", async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });

    const { type = "monthly", expiresAt, maxDevices = 1, gracePeriodDays = 7, notes } = req.body;
    if (!expiresAt) return res.status(400).json({ error: "expiresAt is required" });

    const licenseKey = `MRX-${randomBytes(4).toString("hex").toUpperCase()}-${randomBytes(4).toString("hex").toUpperCase()}`;

    const license = await License.create({
      clientId:       req.params.id,
      licenseKey,
      type,
      status:         "active",
      maxDevices:     Number(maxDevices) || 1,
      gracePeriodDays: Number(gracePeriodDays) || 7,
      expiresAt:      new Date(expiresAt),
      issuedAt:       new Date(),
      activatedAt:    new Date(),
      notes:          notes || null,
    });

    res.status(201).json(license);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/clients/:id/licenses/:licenseId — revoke / extend / update
router.patch("/:id/licenses/:licenseId", async (req, res, next) => {
  try {
    const license = await License.findOne({
      where: { id: req.params.licenseId, clientId: req.params.id },
    });
    if (!license) return res.status(404).json({ error: "License not found" });

    const { status, expiresAt, maxDevices, gracePeriodDays, notes } = req.body;
    const updates = {};
    if (status           !== undefined) updates.status           = status;
    if (expiresAt        !== undefined) updates.expiresAt        = new Date(expiresAt);
    if (maxDevices       !== undefined) updates.maxDevices       = Number(maxDevices);
    if (gracePeriodDays  !== undefined) updates.gracePeriodDays  = Number(gracePeriodDays);
    if (notes            !== undefined) updates.notes            = notes;

    await license.update(updates);
    res.json(license);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/clients/:id — update client details
router.patch("/:id", async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });
    const { name, email, phone } = req.body;
    if (name !== undefined) client.name  = name;
    if (email !== undefined) client.email = email || null;
    if (phone !== undefined) client.phone = phone || null;
    await client.save();
    res.json({ id: client.id, name: client.name, email: client.email, phone: client.phone, status: client.status });
  } catch (err) {
    next(err);
  }
});

// GET /api/clients/:id/reports — comprehensive report data
router.get("/:id/reports", async (req, res, next) => {
  try {
    const clientId = req.params.id;

    const [sales, products, customers, transactions, categories] = await Promise.all([
      Sale.findAll({ where: { clientId } }),
      ErpProduct.findAll({ where: { clientId } }),
      ErpCustomer.findAll({ where: { clientId } }),
      ErpTransaction.findAll({ where: { clientId } }),
      ErpCategory.findAll({ where: { clientId } }),
    ]);

    // — Date boundaries ————————————————————————————————————————
    const now        = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd   = new Date(todayStart.getTime() + 86400000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const getTs = (s) => new Date(s.date || s.createdAt).getTime();

    // — Sales ——————————————————————————————————————————————————
    const saleRows    = sales.filter((s) => s.type !== "return");
    const returnRows  = sales.filter((s) => s.type === "return");
    const amt         = (s) => Math.abs(parseFloat(s.total_amount) || 0);

    const totalCount   = saleRows.length;
    const totalRevenue = saleRows.reduce((a, s) => a + amt(s), 0);
    const avgOrder     = totalCount > 0 ? totalRevenue / totalCount : 0;

    const todaySales   = saleRows.filter((s) => { const t = getTs(s); return t >= todayStart && t < todayEnd; });
    const monthSales   = saleRows.filter((s) => getTs(s) >= monthStart.getTime());

    const byPayment = {};
    saleRows.forEach((s) => {
      const m = s.paymentMethod || "cash";
      if (!byPayment[m]) byPayment[m] = { method: m, count: 0, amount: 0 };
      byPayment[m].count++;
      byPayment[m].amount += amt(s);
    });

    // monthly revenue (last 24 months max)
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

    // sales by cashier (userId)
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

    // — Inventory ——————————————————————————————————————————————
    const LOW_STOCK = 5;
    const activeProducts = products.filter((p) => p.isActive !== false);
    const lowStockList   = activeProducts.filter((p) => parseFloat(p.stock || 0) > 0 && parseFloat(p.stock || 0) <= LOW_STOCK);
    const outOfStockList = activeProducts.filter((p) => parseFloat(p.stock || 0) <= 0);
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

    // — Customers ——————————————————————————————————————————————
    const totalDebt = customers.reduce((a, c) => a + Math.max(0, parseFloat(c.balance || 0)), 0);
    const debtors   = customers.filter((c) => parseFloat(c.balance || 0) > 0).length;
    const topDebtors = customers
      .filter((c) => parseFloat(c.balance || 0) > 0)
      .sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance))
      .slice(0, 10)
      .map((c) => ({ name: c.name, phone: c.phone, balance: parseFloat(parseFloat(c.balance).toFixed(2)) }));

    // — Financial (ErpTransaction) —————————————————————————————
    const income   = transactions.filter((t) => t.type === "income").reduce((a, t) => a + parseFloat(t.amount || 0), 0);
    const expenses = transactions.filter((t) => t.type === "expense").reduce((a, t) => a + parseFloat(t.amount || 0), 0);
    const txByType = {};
    transactions.forEach((t) => {
      const type = t.type || "other";
      if (!txByType[type]) txByType[type] = { type, count: 0, total: 0 };
      txByType[type].count++;
      txByType[type].total += parseFloat(t.amount || 0);
    });
    const txByPayment = {};
    transactions.forEach((t) => {
      const m = t.paymentMethod || "cash";
      if (!txByPayment[m]) txByPayment[m] = { method: m, count: 0, total: 0 };
      txByPayment[m].count++;
      txByPayment[m].total += parseFloat(t.amount || 0);
    });

    res.json({
      sales: {
        total:           { count: totalCount, revenue: parseFloat(totalRevenue.toFixed(2)), avgOrder: parseFloat(avgOrder.toFixed(2)) },
        today:           { count: todaySales.length, revenue: parseFloat(todaySales.reduce((a, s) => a + amt(s), 0).toFixed(2)) },
        thisMonth:       { count: monthSales.length, revenue: parseFloat(monthSales.reduce((a, s) => a + amt(s), 0).toFixed(2)) },
        returns:         { count: returnRows.length, amount: parseFloat(returnRows.reduce((a, s) => a + amt(s), 0).toFixed(2)) },
        byPaymentMethod: Object.values(byPayment).map((p) => ({ ...p, amount: parseFloat(p.amount.toFixed(2)) })),
        monthly,
        byCashier:       byCashierArr,
      },
      inventory: {
        total:      { count: activeProducts.length, totalValue: parseFloat(totalValue.toFixed(2)) },
        lowStock:   lowStockList.map((p) => ({ id: p.id, name: p.name, stock: parseFloat(p.stock || 0), unit: p.unit, price: parseFloat(p.price || 0) })),
        outOfStock: outOfStockList.map((p) => ({ id: p.id, name: p.name })),
        byCategory: Object.values(byCategory).map((c) => ({ ...c, value: parseFloat(c.value.toFixed(2)) })).sort((a, b) => b.value - a.value),
      },
      customers: {
        total:      customers.length,
        debtors,
        totalDebt:  parseFloat(totalDebt.toFixed(2)),
        topDebtors,
      },
      financial: {
        income:    parseFloat(income.toFixed(2)),
        expenses:  parseFloat(expenses.toFixed(2)),
        netProfit: parseFloat((income - expenses).toFixed(2)),
        byType:    Object.values(txByType).map((t) => ({ ...t, total: parseFloat(t.total.toFixed(2)) })),
        byPayment: Object.values(txByPayment).map((t) => ({ ...t, total: parseFloat(t.total.toFixed(2)) })),
      },
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/clients/:id/status
router.patch("/:id/status", async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });
    client.status = client.status === "active" ? "inactive" : "active";
    await client.save();
    res.json({ id: client.id, status: client.status });
  } catch (err) {
    next(err);
  }
});

export { router };
