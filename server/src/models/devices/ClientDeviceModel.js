import { DataTypes } from "sequelize";
import sequelize from "../../config/index.js";

const ClientDevice = sequelize.define(
  "ClientDevice",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "client_id",
    },
    tenantId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "tenant_id",
    },
    deviceId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      field: "device_id",
    },
    deviceName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "POS Terminal",
      field: "device_name",
    },
    machineFingerprint: {
      type: DataTypes.STRING(256),
      allowNull: false,
      field: "machine_fingerprint",
    },
    status: {
      type: DataTypes.ENUM("active", "suspended", "revoked"),
      defaultValue: "active",
    },
    lastSeenAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "last_seen_at",
    },
    registeredAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "registered_at",
    },
  },
  {
    tableName: "client_devices",
    timestamps: false,
    indexes: [
      { fields: ["client_id"] },
      { fields: ["device_id"], unique: true },
      { fields: ["machine_fingerprint", "client_id"] },
    ],
  },
);

export default ClientDevice;
