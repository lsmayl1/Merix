const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");

const Plu = sequelize.define(
  "Plu",
  {
    no: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50), // Ürün adı için maksimum 36 karakter
      allowNull: false,
    },
    lfcode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING(5), // 5 haneli ürün kodu
      allowNull: false,
      unique: false,
    },
    barcode_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 7, // EAN-13 içina
    },
    unit_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weight_unit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 4,
    },
    deptment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 22, // Varsayılan departman
    },
    tare: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    shelf_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Varsayılan raf ömrü
    },
    packagetype: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Varsayılan raf ömrü
    },
    packagetype: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Varsayılan raf ömrü
    },
    packagetolerance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Varsayılan raf ömrü
    },

    zero_data_k: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Varsayılan raf ömrü
    },
    zero_data_l: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Varsayılan raf ömrü
    },
    zero_data_m: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Varsayılan raf ömrü
    },
    zero_data_s: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Varsayılan raf ömrü
    },
    zero_data_q: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Varsayılan raf ömrü
    },
    zero_data_p: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // Varsayılan raf ömrü
    },
    message1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Varsayılan raf ömrü
    },
    message2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Varsayılan raf ömrü
    },
    message3: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Varsayılan raf ömrü
    },
  },
  {
    tableName: "plu",
    timestamps: false, // Zaman damgası istemiyoruz
  }
);

module.exports = Plu;
