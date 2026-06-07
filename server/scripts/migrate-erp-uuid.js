/**
 * migrate-erp-uuid.js
 *
 * Drops and recreates only the six ERP tables so their `id` columns
 * become proper UUID primary keys.  All other tables (clients, users,
 * sales, sync_records, …) are untouched.
 *
 * Usage:
 *   node scripts/migrate-erp-uuid.js
 */

import sequelize from "../src/config/index.js";
import ErpProduct      from "../src/models/erp/ProductModel.js";
import ErpCategory     from "../src/models/erp/CategoryModel.js";
import ErpSupplier     from "../src/models/erp/SupplierModel.js";
import ErpCustomer     from "../src/models/erp/CustomerModel.js";
import ErpTransaction  from "../src/models/erp/TransactionModel.js";
import ErpStockMovement from "../src/models/erp/StockMovementModel.js";

const ERP_TABLES = [
  ErpStockMovement,  // references product, so drop first
  ErpTransaction,
  ErpProduct,
  ErpCategory,
  ErpSupplier,
  ErpCustomer,
];

async function run() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database.");

    for (const Model of ERP_TABLES) {
      console.log(`Dropping table: ${Model.tableName}`);
      await Model.drop({ cascade: true });
    }

    for (const Model of [...ERP_TABLES].reverse()) {
      console.log(`Creating table: ${Model.tableName}`);
      await Model.sync({ force: false });
    }

    console.log("ERP tables migrated to UUID primary keys.");
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

run();
