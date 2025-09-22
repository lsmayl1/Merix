import { sequelize } from "../../models/index.js";

async function resetDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database has been reset successfully.");
  } catch (error) {
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

resetDatabase();
