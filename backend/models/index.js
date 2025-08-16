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
const SupplierTransactionDetails = require("./Supplier/SupplierTransactionDetails");
const Category = require("./category");
// 🔹 İlişkileri Tanımla
Sales.hasMany(SalesDetails, { foreignKey: "sale_id", as: "details" });
SalesDetails.belongsTo(Sales, { foreignKey: "sale_id", as: "sale" });

StockTransactions.belongsTo(Products, {
  foreignKey: "product_id",
  as: "product",
});
Products.hasOne(ProductStock, {
  foreignKey: "product_id",
  as: "stock",
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

// 2) SupplierTransactions → SupplierTransactionDetails
SupplierTransactions.hasMany(SupplierTransactionDetails, {
  foreignKey: "transaction_id", // Detay tablosundaki foreign key
  as: "details",
});

SupplierTransactionDetails.belongsTo(SupplierTransactions, {
  foreignKey: "transaction_id",
  as: "transaction",
});

// 3) Products → SupplierTransactionDetails
Products.hasMany(SupplierTransactionDetails, {
  foreignKey: "product_id",
  as: "transactionDetails",
});
SupplierTransactionDetails.belongsTo(Products, {
  foreignKey: "product_id",
  as: "product",
});

Category.hasMany(Category, {
  as: "subcategories",
  foreignKey: "parent_id",
});

Category.belongsTo(Category, {
  as: "parent",
  foreignKey: "parent_id",
});
Products.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});
Category.hasMany(Products, {
  foreignKey: "category_id",
  as: "products",
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
  SupplierTransactionDetails,
  Category,
};
