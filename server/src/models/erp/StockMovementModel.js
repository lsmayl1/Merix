import { DataTypes } from "sequelize";
import sequelize from "../../config/index.js";

const ErpStockMovement = sequelize.define(
  "ErpStockMovement",
  {
    id:          { type: DataTypes.STRING, primaryKey: true },
    clientId:    { type: DataTypes.UUID, allowNull: false, field: "client_id" },
    productId:   { type: DataTypes.STRING, allowNull: true, field: "product_id" },
    type:        { type: DataTypes.STRING(32), allowNull: true },
    quantity:    { type: DataTypes.DECIMAL(12, 3), defaultValue: 0 },
    unitCost:    { type: DataTypes.DECIMAL(12, 2), allowNull: true, field: "unit_cost" },
    referenceId: { type: DataTypes.STRING, allowNull: true, field: "reference_id" },
    notes:       { type: DataTypes.TEXT, allowNull: true },
    date:        { type: DataTypes.DATE, allowNull: true },
    syncedAt:    { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: "synced_at" },
  },
  { tableName: "erp_stock_movements", timestamps: true },
);

export default ErpStockMovement;
