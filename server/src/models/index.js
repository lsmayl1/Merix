import { Sequelize, Op } from "sequelize";
import sequelize from "../config/index.js";
import Sale from "./sales/SaleModel.js";
import User from "./users/UserModel.js";

// Define associations
User.hasMany(Sale, { foreignKey: "userId" });
Sale.belongsTo(User, { foreignKey: "userId" });
export { Sequelize, Op, sequelize, Sale, User };
