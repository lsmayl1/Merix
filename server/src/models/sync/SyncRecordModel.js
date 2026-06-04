import { DataTypes } from "sequelize";
import sequelize from "../../config/index.js";

const SyncRecord = sequelize.define(
  "SyncRecord",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenantId: { type: DataTypes.STRING, allowNull: false, field: "tenant_id" },
    branchId: { type: DataTypes.STRING, defaultValue: "main", field: "branch_id" },
    entityType: { type: DataTypes.STRING, allowNull: false, field: "entity_type" },
    entityId: { type: DataTypes.STRING, allowNull: false, field: "entity_id" },
    operation: { type: DataTypes.STRING, allowNull: false },
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
    queueId: { type: DataTypes.STRING, field: "queue_id" },
    status: {
      type: DataTypes.ENUM("synced", "conflict", "failed"),
      defaultValue: "synced",
    },
    conflictData: { type: DataTypes.JSONB, field: "conflict_data" },
    data: { type: DataTypes.JSONB },
    receivedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "received_at",
    },
  },
  {
    tableName: "sync_records",
    timestamps: false,
    indexes: [
      { fields: ["tenant_id"] },
      { fields: ["entity_type", "entity_id"] },
      { fields: ["received_at"] },
    ],
  },
);

export default SyncRecord;
