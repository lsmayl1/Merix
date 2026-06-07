import { DataTypes } from "sequelize";
import sequelize from "../../config/index.js";

const DemoRequest = sequelize.define(
  "DemoRequest",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("new", "contacted", "done"),
      defaultValue: "new",
    },
  },
  {
    tableName: "demo_requests",
    timestamps: true,
    indexes: [{ fields: ["status"] }],
  },
);

export default DemoRequest;
