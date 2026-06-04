import { DataTypes } from "sequelize";
import sequelize from "../../config/index.js";

const ErpSupplier = sequelize.define(
  "ErpSupplier",
  {
    id:       { type: DataTypes.STRING, primaryKey: true },
    clientId: { type: DataTypes.UUID, allowNull: false, field: "client_id" },
    name:     { type: DataTypes.STRING, allowNull: false },
    phone:    { type: DataTypes.STRING, allowNull: true },
    email:    { type: DataTypes.STRING, allowNull: true },
    balance:  { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
    syncedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: "synced_at" },
  },
  { tableName: "erp_suppliers", timestamps: true },
);

export default ErpSupplier;
