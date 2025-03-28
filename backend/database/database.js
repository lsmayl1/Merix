const { Sequelize } = require('sequelize');
require('dotenv').config(); // .env dosyasını yükler

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: true, // SQL loglarını görmek için true yapabilirsiniz
  }
);

module.exports = sequelize;