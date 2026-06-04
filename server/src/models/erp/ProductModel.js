import { DataTypes } from "sequelize";
import sequelize from "../../config/index.js";

const ErpProduct = sequelize.define(
  "ErpProduct",
  {
    id:         { type: DataTypes.STRING, primaryKey: true },
    clientId:   { type: DataTypes.UUID, allowNull: false, field: "client_id" },
    name:       { type: DataTypes.STRING, allowNull: false },
    price:      { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    barcode:    { type: DataTypes.STRING, allowNull: true },
    unit:       { type: DataTypes.STRING(32), allowNull: true },
    categoryId: { type: DataTypes.STRING, allowNull: true, field: "category_id" },
    stock:      { type: DataTypes.DECIMAL(12, 3), defaultValue: 0 },
    isActive:   { type: DataTypes.BOOLEAN, defaultValue: true, field: "is_active" },
    rawData:    { type: DataTypes.JSONB, field: "raw_data" },
    syncedAt:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: "synced_at" },
  },
  { tableName: "erp_products", timestamps: true },
);

export default ErpProduct;
