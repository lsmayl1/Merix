import { DataTypes } from "sequelize";
import sequelize from "../../config/index.js";

const Sale = sequelize.define(
  "Sale",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM("cash", "credit_card", "bank_transfer"),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("sale", "return"),
      allowNull: false,
    },
  },
  {
    tableName: "sale",
    timestamps: true,
  }
);

export default Sale;
