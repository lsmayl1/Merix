const { Sequelize, Op } = require("sequelize");
const sequelize = require("../database/database"); // Veritabanı bağlantısı
const Sales = require("./sales");
const Products = require("./products");
const SalesDetails = require("./salesDetails");
const Plu = require("./plu");
const CashTransactions = require("./cashTransactions");
const StockTransactions = require("./stockTransactions");
const ProductStock = require("./productStock");
const Suppliers = require("./Supplier/Suppliers");
const SupplierTransactions = require("./Supplier/SupplierTransaction");
// 🔹 İlişkileri Tanımla
Sales.hasMany(SalesDetails, { foreignKey: "sale_id", as: "details" });
SalesDetails.belongsTo(Sales, { foreignKey: "sale_id", as: "sale" });

StockTransactions.belongsTo(Products, {
  foreignKey: "product_id",
  as: "product",
});

ProductStock.belongsTo(Products, {
  foreignKey: "product_id",
  as: "product",
});
Products.hasMany(SalesDetails, {
  foreignKey: "product_id",
  as: "salesDetails",
});
SalesDetails.belongsTo(Products, { foreignKey: "product_id", as: "product" });

// 🔹 Modelleri ve Sequelize Nesnesini Dışa Aktar

SupplierTransactions.belongsTo(Suppliers, {
  foreignKey: "supplier_id",
  as: "supplier",
});

Suppliers.hasMany(SupplierTransactions, {
  foreignKey: "supplier_id",
  as: "transactions",
});

module.exports = {
  sequelize,
  Sequelize,
  Sales,
  Products,
  SalesDetails,
  Plu,
  Op,
  CashTransactions,
  StockTransactions,
  ProductStock,
  Suppliers,
  SupplierTransactions,
};
