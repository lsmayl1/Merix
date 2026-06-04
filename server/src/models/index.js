import { Sequelize, Op } from "sequelize";
import sequelize from "../config/index.js";
import Sale from "./sales/SaleModel.js";
import User from "./users/UserModel.js";
import Client from "./clients/ClientModel.js";
import Company from "./companies/CompanyModel.js";
import SyncRecord from "./sync/SyncRecordModel.js";
import ClientDevice from "./devices/ClientDeviceModel.js";
import License from "./licenses/LicenseModel.js";
import ErpProduct from "./erp/ProductModel.js";
import ErpCategory from "./erp/CategoryModel.js";
import ErpSupplier from "./erp/SupplierModel.js";
import ErpCustomer from "./erp/CustomerModel.js";
import ErpTransaction from "./erp/TransactionModel.js";
import ErpStockMovement from "./erp/StockMovementModel.js";

// Associations
Client.hasMany(User, { foreignKey: "clientId", as: "users" });
User.belongsTo(Client, { foreignKey: "clientId", as: "client" });

Client.hasMany(Sale, { foreignKey: "clientId", as: "sales" });
Sale.belongsTo(Client, { foreignKey: "clientId", as: "client" });

Client.hasMany(Company, { foreignKey: "clientId", as: "companies" });
Company.belongsTo(Client, { foreignKey: "clientId", as: "client" });

User.hasMany(Sale, { foreignKey: "userId" });
Sale.belongsTo(User, { foreignKey: "userId" });

// Device + License associations
Client.hasMany(ClientDevice, { foreignKey: "client_id", as: "devices", constraints: false });
ClientDevice.belongsTo(Client, { foreignKey: "client_id", as: "client", constraints: false });

Client.hasMany(License, { foreignKey: "client_id", as: "licenses", constraints: false });
License.belongsTo(Client, { foreignKey: "client_id", as: "client", constraints: false });

export {
  Sequelize, Op, sequelize,
  Sale, User, Client, Company, SyncRecord, ClientDevice, License,
  ErpProduct, ErpCategory, ErpSupplier, ErpCustomer, ErpTransaction, ErpStockMovement,
};
