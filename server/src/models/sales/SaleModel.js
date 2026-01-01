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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    subtotal_amount: {
      type: DataTypes.DECIMAL(10, 2), // 10 hane, 2 ondalık
      allowNull: false,
      defaultValue: 0.0,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2), // 10 hane, 2 ondalık
      allowNull: false,
    },
    discount: {
      type: DataTypes.DECIMAL(5, 2), // İndirim yüzdesi
      defaultValue: 0.0, // Varsayılan indirim %0
    },
    discounted_amount: {
      type: DataTypes.DECIMAL(10, 2), // İndirimli tutar
      defaultValue: 0.0,
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
