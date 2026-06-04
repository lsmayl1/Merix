import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { sequelize } from "./src/models/index.js";
import routes from "./src/routes/index.js";
import ErrorHandler from "./src/middlewares/ErrorHandler.js";
import cors from "cors";
import { runMigrations } from "./src/utils/runMigrations.js";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", (_req, res) => res.json({ ok: true }));
routes(app);
app.use(ErrorHandler);
// Sequelize Sync ve Server Başlatma

sequelize
  .sync()
  .then(async () => {
    await runMigrations(sequelize);
    app.listen(3000, "0.0.0.0", () => {
      console.log(`Server is running on http://localhost:${3000}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
