/**
 * Merix Admin — full seed script (non-interactive)
 * Usage:  npm run seed:all
 *         npm run seed:all -- --force   (wipes & re-seeds)
 *
 * Creates: Client, Company, Users, License, Devices,
 *          Products, Categories, Suppliers, Customers,
 *          Transactions, Sales, StockMovements
 */

import dotenv from "dotenv";
dotenv.config();

import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import sequelize from "../src/config/index.js";
import {
  Client, User, Company, License, ClientDevice, Sale,
  ErpProduct, ErpCategory, ErpSupplier, ErpCustomer,
  ErpTransaction, ErpStockMovement,
} from "../src/models/index.js";

const force = process.argv.includes("--force");

// ── Helpers ─────────────────────────────────────────────────────────────────

const uuid = () => randomUUID();
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => +(Math.random() * (max - min) + min).toFixed(2);
const pastDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
};

// ── Seed data ───────────────────────────────────────────────────────────────

async function seedAll() {
  console.log("\n=== Merix Admin — Full Database Seed ===\n");

  await sequelize.sync();

  if (!force) {
    const existing = await Client.count();
    if (existing > 0) {
      console.log(`Database already has ${existing} client(s). Run with --force to re-seed.\n`);
      process.exit(0);
    }
  }

  if (force) {
    console.log("[~] Force mode — clearing existing data...");
    // Delete in dependency order
    await ErpStockMovement.destroy({ where: {}, force: true });
    await ErpTransaction.destroy({ where: {}, force: true });
    await ErpCustomer.destroy({ where: {}, force: true });
    await ErpSupplier.destroy({ where: {}, force: true });
    await ErpProduct.destroy({ where: {}, force: true });
    await ErpCategory.destroy({ where: {}, force: true });
    await Sale.destroy({ where: {}, force: true });
    await ClientDevice.destroy({ where: {}, force: true });
    await License.destroy({ where: {}, force: true });
    await Company.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });
    await Client.destroy({ where: {}, force: true });
    console.log("[~] All tables cleared.\n");
  }

  const t = await sequelize.transaction();

  try {
    // ── 1. Clients (companies using the system) ──────────────────────────

    const clientsData = [
      { name: "Qlobus Market",          email: "info@qlobus.az",       phone: "+994501234567" },
      { name: "NovaTech Solutions",      email: "hello@novatech.az",    phone: "+994502345678" },
      { name: "Caspian Electronics",     email: "sales@caspianelec.az", phone: "+994503456789" },
    ];

    const clients = [];
    for (const cd of clientsData) {
      const client = await Client.create({ ...cd, status: "active" }, { transaction: t });
      clients.push(client);
      console.log(`[+] Client: ${client.name} (${client.id})`);
    }

    // ── 2. Companies (ERP profiles for each client) ──────────────────────

    for (const client of clients) {
      await Company.create({
        company_id: uuid(),
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: `Baku, Azerbaijan — ${client.name} HQ`,
        is_active: true,
        clientId: client.id,
      }, { transaction: t });
    }
    console.log(`[+] Companies: ${clients.length} created`);

    // ── 3. Users (employees per client) ──────────────────────────────────

    const passwordHash = await bcrypt.hash("password123", 10);

    const usersPerClient = [
      [
        { firstName: "Ismayil",  lastName: "Aliyev",   email: "ismayil@qlobus.az",   role: "admin" },
        { firstName: "Aysel",    lastName: "Mammadova", email: "aysel@qlobus.az",     role: "manager" },
        { firstName: "Elvin",    lastName: "Hasanov",   email: "elvin@qlobus.az",     role: "cashier" },
        { firstName: "Gunel",    lastName: "Rustamova", email: "gunel@qlobus.az",     role: "cashier" },
      ],
      [
        { firstName: "Farid",    lastName: "Karimov",   email: "farid@novatech.az",   role: "admin" },
        { firstName: "Leyla",    lastName: "Huseynova", email: "leyla@novatech.az",   role: "manager" },
        { firstName: "Tural",    lastName: "Ibrahimov", email: "tural@novatech.az",   role: "cashier" },
      ],
      [
        { firstName: "Rashad",   lastName: "Guliyev",   email: "rashad@caspianelec.az", role: "admin" },
        { firstName: "Nigar",    lastName: "Abbasova",  email: "nigar@caspianelec.az",  role: "cashier" },
      ],
    ];

    const allUsers = [];
    for (let i = 0; i < clients.length; i++) {
      for (const ud of usersPerClient[i]) {
        const user = await User.create({
          ...ud,
          phoneNumber: `+9945${String(Math.floor(Math.random() * 90000000 + 10000000))}`,
          password: passwordHash,
          clientId: clients[i].id,
          status: "active",
          permissions: [],
        }, { transaction: t });
        allUsers.push({ user, clientIdx: i });
      }
    }
    console.log(`[+] Users: ${allUsers.length} created (password: password123)`);

    // ── 4. Licenses ──────────────────────────────────────────────────────

    const licenseTypes = ["yearly", "monthly", "lifetime"];
    for (let i = 0; i < clients.length; i++) {
      const ltype = licenseTypes[i % licenseTypes.length];
      const now = new Date();
      const expiresAt = ltype === "lifetime" ? null : new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

      await License.create({
        clientId: clients[i].id,
        licenseKey: `LIC-${uuid().toUpperCase().slice(0, 16)}`,
        type: ltype,
        status: "active",
        maxDevices: 5,
        features: [],
        gracePeriodDays: 7,
        issuedAt: now,
        activatedAt: now,
        expiresAt,
      }, { transaction: t });
    }
    console.log(`[+] Licenses: ${clients.length} created`);

    // ── 5. Devices ───────────────────────────────────────────────────────

    for (const client of clients) {
      const deviceCount = Math.floor(Math.random() * 2) + 1;
      for (let d = 0; d < deviceCount; d++) {
        await ClientDevice.create({
          clientId: client.id,
          deviceId: uuid(),
          deviceName: `POS Terminal ${d + 1}`,
          machineFingerprint: uuid(),
          status: "active",
          registeredAt: pastDate(Math.floor(Math.random() * 60)),
          lastSeenAt: pastDate(Math.floor(Math.random() * 3)),
        }, { transaction: t });
      }
    }
    console.log(`[+] Devices: created for all clients`);

    // ── 6. Categories ────────────────────────────────────────────────────

    const categoryNames = ["Electronics", "Stationery", "Food & Drinks", "Household", "Clothing", "Health & Beauty"];
    const categoryMap = {};

    for (const client of clients) {
      categoryMap[client.id] = [];
      for (const catName of categoryNames) {
        const cat = await ErpCategory.create({
          id: uuid(),
          clientId: client.id,
          name: catName,
          syncedAt: new Date(),
        }, { transaction: t });
        categoryMap[client.id].push(cat);
      }
    }
    console.log(`[+] Categories: ${categoryNames.length} per client`);

    // ── 7. Products ──────────────────────────────────────────────────────

    const productTemplates = [
      { name: "Notebook A5",        price: 3.50,  unit: "piece", cat: 1, barcode: "8680000001" },
      { name: "Ballpoint Pen",      price: 0.80,  unit: "piece", cat: 1, barcode: "8680000002" },
      { name: "USB Flash 32GB",     price: 12.00, unit: "piece", cat: 0, barcode: "8680000003" },
      { name: "Wireless Mouse",     price: 18.50, unit: "piece", cat: 0, barcode: "8680000004" },
      { name: "Bottled Water 0.5L", price: 0.50,  unit: "piece", cat: 2, barcode: "8680000005" },
      { name: "Chocolate Bar",      price: 1.20,  unit: "piece", cat: 2, barcode: "8680000006" },
      { name: "Hand Soap",          price: 2.50,  unit: "piece", cat: 5, barcode: "8680000007" },
      { name: "Paper Towels",       price: 4.00,  unit: "pack",  cat: 3, barcode: "8680000008" },
      { name: "T-Shirt Basic",      price: 9.90,  unit: "piece", cat: 4, barcode: "8680000009" },
      { name: "Keyboard USB",       price: 15.00, unit: "piece", cat: 0, barcode: "8680000010" },
      { name: "Headphones",         price: 22.00, unit: "piece", cat: 0, barcode: "8680000011" },
      { name: "Printer Paper A4",   price: 6.50,  unit: "pack",  cat: 1, barcode: "8680000012" },
      { name: "Energy Drink",       price: 2.00,  unit: "piece", cat: 2, barcode: "8680000013" },
      { name: "Face Cream",         price: 7.80,  unit: "piece", cat: 5, barcode: "8680000014" },
      { name: "Dish Soap",          price: 3.20,  unit: "piece", cat: 3, barcode: "8680000015" },
    ];

    const productMap = {};
    for (const client of clients) {
      productMap[client.id] = [];
      for (const pt of productTemplates) {
        const prod = await ErpProduct.create({
          id: uuid(),
          clientId: client.id,
          name: pt.name,
          price: pt.price,
          barcode: `${pt.barcode}${client.id.slice(0, 4)}`,
          unit: pt.unit,
          categoryId: categoryMap[client.id][pt.cat]?.id || null,
          stock: Math.floor(Math.random() * 200) + 10,
          isActive: true,
          rawData: {},
          syncedAt: new Date(),
        }, { transaction: t });
        productMap[client.id].push(prod);
      }
    }
    console.log(`[+] Products: ${productTemplates.length} per client`);

    // ── 8. Suppliers ─────────────────────────────────────────────────────

    const supplierNames = [
      { name: "AZ Supply Co.",    email: "orders@azsupply.az",  phone: "+994701112233" },
      { name: "Global Imports",   email: "info@globalimports.az", phone: "+994702223344" },
      { name: "Caspian Wholesale", email: "sales@caspianwhole.az", phone: "+994703334455" },
    ];

    for (const client of clients) {
      for (const sd of supplierNames) {
        await ErpSupplier.create({
          id: uuid(),
          clientId: client.id,
          name: sd.name,
          email: sd.email,
          phone: sd.phone,
          balance: rand(0, 5000),
          syncedAt: new Date(),
        }, { transaction: t });
      }
    }
    console.log(`[+] Suppliers: ${supplierNames.length} per client`);

    // ── 9. Customers ─────────────────────────────────────────────────────

    const customerNames = [
      { name: "Ali Mammadov",    phone: "+994551001010" },
      { name: "Sara Aliyeva",    phone: "+994551002020" },
      { name: "Kamran Hasanli",  phone: "+994551003030" },
      { name: "Aydan Huseynli", phone: "+994551004040" },
      { name: "Orkhan Babayev",  phone: "+994551005050" },
    ];

    for (const client of clients) {
      for (const cd of customerNames) {
        await ErpCustomer.create({
          id: uuid(),
          clientId: client.id,
          name: cd.name,
          phone: cd.phone,
          email: `${cd.name.split(" ")[0].toLowerCase()}@mail.az`,
          balance: rand(0, 500),
          syncedAt: new Date(),
        }, { transaction: t });
      }
    }
    console.log(`[+] Customers: ${customerNames.length} per client`);

    // ── 10. Sales ────────────────────────────────────────────────────────

    const paymentMethods = ["cash", "credit_card", "card", "mixed"];

    for (const client of clients) {
      const clientUsers = allUsers.filter((u) => u.user.clientId === client.id);
      const saleCount = Math.floor(Math.random() * 30) + 20;

      for (let s = 0; s < saleCount; s++) {
        const subtotal = rand(5, 200);
        const discount = Math.random() > 0.7 ? rand(1, subtotal * 0.2) : 0;
        const total = +(subtotal - discount).toFixed(2);
        const isReturn = Math.random() > 0.9;

        await Sale.create({
          userId: pick(clientUsers)?.user.id || null,
          clientId: client.id,
          subtotal_amount: subtotal,
          total_amount: total,
          discount: discount,
          discounted_amount: discount,
          paymentMethod: pick(paymentMethods),
          type: isReturn ? "return" : "sale",
          date: pastDate(Math.floor(Math.random() * 90)),
        }, { transaction: t });
      }
    }
    console.log(`[+] Sales: 20-50 per client`);

    // ── 11. Transactions ─────────────────────────────────────────────────

    const txTypes = ["income", "expense", "transfer"];

    for (const client of clients) {
      const txCount = Math.floor(Math.random() * 15) + 10;
      for (let i = 0; i < txCount; i++) {
        await ErpTransaction.create({
          id: uuid(),
          clientId: client.id,
          type: pick(txTypes),
          amount: rand(10, 1000),
          paymentMethod: pick(["cash", "bank_transfer", "card"]),
          notes: pick(["Supplier payment", "Rent", "Salary", "Utility bill", "Stock purchase", "Refund", null]),
          date: pastDate(Math.floor(Math.random() * 60)),
          syncedAt: new Date(),
        }, { transaction: t });
      }
    }
    console.log(`[+] Transactions: 10-25 per client`);

    // ── 12. Stock Movements ──────────────────────────────────────────────

    const moveTypes = ["purchase", "sale", "adjustment", "return"];

    for (const client of clients) {
      const products = productMap[client.id];
      const moveCount = Math.floor(Math.random() * 20) + 10;

      for (let i = 0; i < moveCount; i++) {
        const prod = pick(products);
        await ErpStockMovement.create({
          id: uuid(),
          clientId: client.id,
          productId: prod.id,
          type: pick(moveTypes),
          quantity: Math.floor(Math.random() * 50) + 1,
          unitCost: prod.price,
          date: pastDate(Math.floor(Math.random() * 60)),
          syncedAt: new Date(),
        }, { transaction: t });
      }
    }
    console.log(`[+] Stock Movements: 10-30 per client`);

    // ── Commit ───────────────────────────────────────────────────────────

    await t.commit();

    console.log("\n=== Seed Complete ===");
    console.log("  3 companies, each with employees, products, sales, and more.");
    console.log("  All user passwords: password123");
    console.log("  Admin emails:");
    for (let i = 0; i < clients.length; i++) {
      const admin = usersPerClient[i].find((u) => u.role === "admin");
      console.log(`    ${clients[i].name}: ${admin.email}`);
    }
    console.log("");

  } catch (err) {
    await t.rollback();
    console.error("\n[!] Seed failed:", err.message);
    console.error(err.stack);
    process.exit(1);
  }

  process.exit(0);
}

seedAll().catch((err) => { console.error(err); process.exit(1); });
