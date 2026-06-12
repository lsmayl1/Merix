import { DataTypes } from "sequelize";
import sequelize from "../../config/index.js";

/**
 * Idempotency / deduplication log for incoming sync operations.
 *
 * Every successfully applied sync item is recorded here keyed by
 * (tenant_id, queue_id). The unique constraint is the hard guarantee that a
 * given idempotency key (the sender's sync_queue row id) is applied exactly
 * once — even if the sender retries after a lost acknowledgment or two
 * duplicate batches race concurrently.
 */
const ProcessedOperation = sequelize.define(
  "ProcessedOperation",
  {
    id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenantId:   { type: DataTypes.STRING, allowNull: false, field: "tenant_id" },
    queueId:    { type: DataTypes.STRING, allowNull: false, field: "queue_id" },
    entityType: { type: DataTypes.STRING, field: "entity_type" },
    entityId:   { type: DataTypes.STRING, field: "entity_id" },
    operation:  { type: DataTypes.STRING },
    status:     { type: DataTypes.STRING, defaultValue: "synced" },
    processedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: "processed_at" },
  },
  {
    tableName: "processed_operations",
    timestamps: false,
    indexes: [
      { unique: true, fields: ["tenant_id", "queue_id"], name: "processed_operations_tenant_queue_uq" },
      { fields: ["processed_at"] },
    ],
  },
);

export default ProcessedOperation;
