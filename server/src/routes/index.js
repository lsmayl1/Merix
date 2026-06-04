import { router as SaleController }     from "../controllers/sales/SaleController.js";
import { router as SyncController }     from "../controllers/sync/SyncController.js";
import { validateSyncAuth }             from "../middlewares/SyncAuthMiddleware.js";
import { router as ErpAuthController }  from "../controllers/erp/ErpAuthController.js";
import { router as AuthController }     from "../controllers/auth/AuthController.js";
import { router as ClientController }   from "../controllers/clients/ClientController.js";
import { router as CompanyController }  from "../controllers/companies/CompanyController.js";
import { router as DatabaseController } from "../controllers/database/DatabaseController.js";
import { router as AccountController }  from "../controllers/account/AccountController.js";
import { authenticate }                 from "../middlewares/AuthMiddleware.js";
import express from "express";
import bcrypt from "bcrypt";
import { Client, Company, User } from "../models/index.js";
import sequelize from "../config/index.js";

const setupRouter = express.Router();

setupRouter.post("/", async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { companyName, companyEmail, companyPhone, companyAddress, firstName, lastName, email, phoneNumber, password } = req.body;

    if (!companyName) return res.status(400).json({ error: "companyName is required" });
    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ error: "firstName, lastName, email and password are required" });

    const client = await Client.create(
      { name: companyName, email: companyEmail, phone: companyPhone }, { transaction: t }
    );
    await Company.create(
      { name: companyName, email: companyEmail || null, phone: companyPhone || null,
        address: companyAddress || null, is_active: true, clientId: client.id }, { transaction: t }
    );

    const existing = await User.findOne({ where: { email }, transaction: t });
    if (existing) { await t.rollback(); return res.status(400).json({ error: "A user with this email already exists" }); }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create(
      { firstName, lastName, email, phoneNumber: phoneNumber || email, password: hash, clientId: client.id },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({
      success: true,
      client: { id: client.id, name: client.name },
      user:   { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
});

export default (app) => {
  app.use("/api/auth",     AuthController);
  app.use("/api/setup",    setupRouter);
  app.use("/api/sale",     authenticate, SaleController);
  app.use("/api/sync",     validateSyncAuth, SyncController);
  app.use("/api/erp/auth", ErpAuthController);
  app.use("/api/clients",  authenticate, ClientController);
  app.use("/api/companies",authenticate, CompanyController);
  app.use("/api/database", authenticate, DatabaseController);
  app.use("/api/account",  authenticate, AccountController);
};
