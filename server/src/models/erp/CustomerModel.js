import { DataTypes } from "sequelize";
import sequelize from "../../config/index.js";

const ErpCustomer = sequelize.define(
  "ErpCustomer",
  {
    id:       { type: DataTypes.STRING, primaryKey: true },
    clientId: { type: DataTypes.UUID, allowNull: false, field: "client_id" },
    name:     { type: DataTypes.STRING, allowNull: false },
    phone:    { type: DataTypes.STRING, allowNull: true },
    email:    { type: DataTypes.STRING, allowNull: true },
    balance:  { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
    syncedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: "synced_at" },
  },
  { tableName: "erp_customers", timestamps: true },
);

export default ErpCustomer;
