const { Sequelize, Op } = require("sequelize");
const sequelize = require("../database/database"); // Veritabanı bağlantısı
const Sales = require("./sales");
const Products = require("./products");
const SalesDetails = require("./salesDetails");
const Plu = require("./plu");
const CashTransactions = require("./cashTransactions");
// 🔹 İlişkileri Tanımla
Sales.hasMany(SalesDetails, { foreignKey: "sale_id", as: "details" });
SalesDetails.belongsTo(Sales, { foreignKey: "sale_id", as: "sale" });

Products.hasMany(SalesDetails, {
  foreignKey: "product_id",
  as: "salesDetails",
});
SalesDetails.belongsTo(Products, { foreignKey: "product_id", as: "product" });

// 🔹 Modelleri ve Sequelize Nesnesini Dışa Aktar
module.exports = {
  sequelize,
  Sequelize,
  Sales,
  Products,
  SalesDetails,
  Plu,
  Op,
  CashTransactions,
};
