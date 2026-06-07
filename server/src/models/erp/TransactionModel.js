import { DataTypes } from "sequelize";
import sequelize from "../../config/index.js";

const ErpTransaction = sequelize.define(
  "ErpTransaction",
  {
    id:            { type: DataTypes.UUID, primaryKey: true },
    clientId:      { type: DataTypes.UUID, allowNull: false, field: "client_id" },
    type:          { type: DataTypes.STRING(32), allowNull: true },
    amount:        { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
    paymentMethod: { type: DataTypes.STRING(32), allowNull: true, field: "payment_method" },
    categoryId:    { type: DataTypes.UUID, allowNull: true, field: "category_id" },
    accountId:     { type: DataTypes.UUID, allowNull: true, field: "account_id" },
    notes:         { type: DataTypes.TEXT, allowNull: true },
    date:          { type: DataTypes.DATE, allowNull: true },
    syncedAt:      { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: "synced_at" },
  },
  { tableName: "erp_transactions", timestamps: true },
);

export default ErpTransaction;
