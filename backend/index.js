require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { sequelize } = require("./models");
const productsRoute = require("./routes/productsRoute");
const salesRoutes = require("./routes/salesRoute");
const pluRoute = require("./routes/pluRoute");
const labelPrinterRoute = require("./routes/labelPrinterRoute");
const reportsRoute = require("./routes/reportsRoute");
const app = express();
app.use(express.json()); // For parsing JSON requests
app.use(cors());

// Mount the product routes
app.use("/products", productsRoute);
app.use("/sales", salesRoutes);
app.use("/plu", pluRoute);
app.use("/printer", labelPrinterRoute);
app.use("/reports", reportsRoute);

// Sync the database
sequelize.sync().then(() => {
  app.listen(process.env.PORT, "0.0.0.0", () => {
    console.log(
      `Server is running on http://localhost:${process.env.PORT || 3000}`
    );
  });
});

module.exports = app;
