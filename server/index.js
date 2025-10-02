import dotenv from "dotenv";
import express from "express";
import { sequelize } from "./src/models/index.js";
import { router as SaleController } from "./src/controllers/sales/SaleController.js";
import { router as SyncController } from "./src/controllers/sync/SyncController.js";
import { router as AuthController } from "./src/controllers/auth/AuthController.js";
import { authenticate } from "./src/middlewares/AuthMiddleware.js";
import ErrorHandler from "./src/middlewares/ErrorHandler.js";
import cors from "cors";

const app = express();
cors();
app.use(cors());
dotenv.config();
app.use(express.json());
app.use("/sales", authenticate, SaleController);
app.use("/sync", SyncController);
app.use("/auth", AuthController);
app.use(ErrorHandler);
// Sequelize Sync ve Server Başlatma

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
