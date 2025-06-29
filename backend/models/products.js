const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");

const Products = sequelize.define(
  "products",
  {
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true, // Assuming barcodes should be unique
    },
    buyPrice: {
      type: DataTypes.DECIMAL(10, 2), // 10 digits, 2 after decimal
      allowNull: true,
    },
    sellPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    unit: {
      type: DataTypes.ENUM("piece", "kg"),
      allowNull: false,
    },
    stock: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
      defaultValue: 0,  
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Automatically set to current timestamp
    },
  },
  {
    timestamps: false, // Disable Sequelize's default createdAt/updatedAt
    tableName: "products", // Explicit table name
  }
);

module.exports = Products;
