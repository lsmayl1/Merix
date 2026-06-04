import { DataTypes } from "sequelize";
import sequelize from "../../config/index.js";

const License = sequelize.define(
  "License",
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
    licenseKey: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
      field: "license_key",
    },
    type: {
      type: DataTypes.ENUM("trial", "monthly", "yearly", "lifetime"),
      defaultValue: "trial",
    },
    status: {
      type: DataTypes.ENUM("active", "expired", "suspended", "cancelled"),
      defaultValue: "active",
    },
    maxDevices: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      field: "max_devices",
    },
    features: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    gracePeriodDays: {
      type: DataTypes.INTEGER,
      defaultValue: 7,
      field: "grace_period_days",
    },
    issuedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "issued_at",
    },
    activatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "activated_at",
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "expires_at",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "licenses",
    timestamps: true,
    indexes: [{ fields: ["client_id"] }, { fields: ["license_key"], unique: true }],
  },
);

export default License;
