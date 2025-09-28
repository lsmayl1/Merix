import dotenv from "dotenv";
import express from "express";
import { sequelize } from "./src/models/index.js";
import { router as SaleController } from "./src/controllers/sales/SaleController.js";
import { router as SyncController } from "./src/controllers/sync/SyncController.js";
import { router as AuthController } from "./src/controllers/auth/AuthController.js";
import { authenticate } from "./src/middlewares/AuthMiddleware.js";
const app = express();

dotenv.config();
app.use(express.json());
app.use("/sales", authenticate, SaleController);
app.use("/sync", SyncController);
app.use("/auth", AuthController);

// Sequelize Sync ve Server Başlatma
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.isOperational ? err.message : "Somethings went wrong";
  console.error(err);
  res.status(statusCode).json({
    statusCode,
    success: false,
    message: message || err, // sadece temiz mesaj döner
  });
});

sequelize
  .sync()
  .then(() => {
    app.listen(3000, "0.0.0.0", () => {
      console.log(`Server is running on http://localhost:${3000}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
