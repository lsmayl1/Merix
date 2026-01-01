import dotenv from "dotenv";
import express from "express";
import { sequelize } from "./src/models/index.js";
import routes from "./src/routes/index.js";
import ErrorHandler from "./src/middlewares/ErrorHandler.js";
import cors from "cors";

const app = express();
cors();
app.use(cors());
dotenv.config();
app.use(express.json());
routes(app);
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
