import { router as SaleController } from "../controllers/sales/SaleController.js";
import { router as SyncController } from "../controllers/sync/SyncController.js";
import { router as AuthController } from "../controllers/auth/AuthController.js";

export default (app) => {
  app.use("/api/auth", AuthController);
  app.use("/api/sale", SaleController);
};
