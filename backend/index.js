require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { sequelize } = require("./models");
const productsRoute = require("./routes/productsRoute");
const salesRoutes = require("./routes/salesRoute");
const pluRoute = require("./routes/pluRoute");
const labelPrinterRoute = require("./routes/labelPrinterRoute");
const reportsRoute = require("./routes/reportsRoute");
const metricRoute = require("./routes/MetricRoute");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");

app.use(express.json()); // For parsing JSON requests
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Sync the database

const isDbConfigured =
  process.env.DB_HOST &&
  process.env.DB_USER &&
  process.env.DB_PASSWORD &&
  process.env.DB_NAME &&
  process.env.DB_PORT;

// Her durumda çalışan endpoint (Konfigürasyon için)
app.post("/configure-db", (req, res) => {
  const { host, port, user, password, database } = req.body;

  const configContent = `
DB_HOST=${host}
DB_PORT=${port}
DB_USER=${user}
DB_PASSWORD=${password}
DB_NAME=${database}
PORT=${process.env.PORT || 3000}
    `;
  fs.writeFileSync(path.join(__dirname, ".env"), configContent);

  setTimeout(() => {
    process.exit(0); // PM2 bunu algılar ve uygulamayı yeniden başlatır
  }, 1000);

  return res.json({
    message: "Database config saved. Please restart the server.",
  });
});

if (isDbConfigured) {
  // Route'ları mount et
  app.use("/products", productsRoute);
  app.use("/sales", salesRoutes);
  app.use("/metrics", metricRoute);
  app.use("/plu", pluRoute);
  app.use("/printer", labelPrinterRoute);
  app.use("/reports", reportsRoute);

  // Tüm istekleri React dist klasörüne yönlendir
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });

  // Sequelize Sync ve Server Başlatma
  sequelize
    .sync()
    .then(() => {
      app.listen(process.env.PORT, "0.0.0.0", () => {
        console.log(
          `Server is running on http://localhost:${process.env.PORT || 3000}`
        );
      });
    })
    .catch((err) => {
      console.error("Database connection failed:", err);
      process.exit(1);
    });
} else {
  console.log(
    "Database config missing. Only /configure-db endpoint is available."
  );
  app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
    console.log(
      `Server running in limited mode on http://localhost:${
        process.env.PORT || 3000
      }`
    );
  });
}

module.exports = app;
