import { DataTypes } from "sequelize";
import sequelize from "../../config/index.js";

const Company = sequelize.define(
  "Company",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    company_id: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Original company_id from MerixERP instance",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "companies",
    timestamps: true,
  }
);

export default Company;
