import express from "express";
import bcrypt from "bcrypt";
import {
  Client, Sale, User, Company, Op,
  ErpProduct, ErpCategory, ErpSupplier, ErpCustomer,
  ErpTransaction, ErpStockMovement, ClientDevice, License,
} from "../../models/index.js";
import { CalculateSale } from "../../services/report/SaleReport.js";
import { DateFormat } from "../../utils/DateFormat.js";

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
