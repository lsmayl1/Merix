import { DataTypes } from "sequelize";
import sequelize from "../../config/index.js";

const ErpCategory = sequelize.define(
  "ErpCategory",
  {
    id:       { type: DataTypes.STRING, primaryKey: true },
    clientId: { type: DataTypes.UUID, allowNull: false, field: "client_id" },
    name:     { type: DataTypes.STRING, allowNull: false },
    parentId: { type: DataTypes.STRING, allowNull: true, field: "parent_id" },
    syncedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: "synced_at" },
  },
  { tableName: "erp_categories", timestamps: true },
);

export default ErpCategory;
