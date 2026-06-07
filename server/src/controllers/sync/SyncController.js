import express from "express";
import { AppError } from "../../utils/AppError.js";
import { tenantEntityId } from "../../utils/tenantEntityId.js";
import {
  Sale, Company, SyncRecord, sequelize,
  ErpProduct, ErpCategory, ErpSupplier, ErpCustomer,
  ErpTransaction, ErpStockMovement,
} from "../../models/index.js";

// ─── Pull endpoint — ERP fetches its own data back from the Admin server ──────



const router = express.Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Upsert by UUID primary key */
async function upsert(Model, uuid, row, t) {
  const existing = await Model.findByPk(uuid, { transaction: t });
  if (!existing) {
    await Model.create({ ...row, id: uuid }, { transaction: t });
  } else {
    await existing.update(row, { transaction: t });
  }
}

async function destroy(Model, uuid, t) {
  const existing = await Model.findByPk(uuid, { transaction: t });
  if (existing) await existing.destroy({ transaction: t });
}

// ─── Entity handlers ──────────────────────────────────────────────────────────

async function handleSale(entityId, operation, data, tenantId, t) {
  if (operation === "DELETE") return; // sales are never deleted

  // Derive primary payment method from payments array if present
  let paymentMethod = data.payment_method ?? data.paymentMethod ?? null;
  if (!paymentMethod && Array.isArray(data.payments) && data.payments.length > 0) {
    if (data.payments.length === 1) {
      // map ERP "card" → "credit_card" for Admin enum
      const pt = data.payments[0].payment_type;
      paymentMethod = pt === "card" ? "credit_card" : (pt ?? "cash");
    } else {
      paymentMethod = "mixed";
    }
  }

  // Only link clientId if the tenant actually exists in our clients table
  const { Client } = await import("../../models/index.js");
  const clientExists = tenantId
    ? await Client.findByPk(tenantId, { transaction: t })
    : null;

  const row = {
    id:               String(entityId),
    clientId:         clientExists ? tenantId : null,
    total_amount:     data.totalAmount      ?? data.total_amount      ?? 0,
    subtotal_amount:  data.subtotalAmount   ?? data.subtotal_amount   ?? 0,
    discount:         data.discount         ?? 0,
    discounted_amount: data.discountedAmount ?? data.discounted_amount ?? 0,
    paymentMethod,
    type:             data.transaction_type ?? data.type              ?? null,
    date:             data.date             ?? null,
    userId:           data.userId           ?? null,
  };

  const existing = await Sale.findOne({ where: { id: String(entityId) }, transaction: t });
  if (!existing) {
    await Sale.create(row, { transaction: t });
  } else {
    await existing.update(row, { transaction: t });
  }
}

async function handleCompany(entityId, operation, data, tenantId, t) {
  const name    = data.company_name ?? data.name;
  const email   = data.company_email ?? data.email ?? null;
  const phone   = data.company_phone ?? data.phone ?? null;
  const address = data.company_address ?? data.address ?? null;

  if (operation === "DELETE") {
    const existing = await Company.findOne({ where: { company_id: String(entityId) }, transaction: t });
    if (existing) await existing.destroy({ transaction: t });
    return;
  }

  // Update the Client record that owns this tenant so its name/contact reflects the real company
  if (tenantId) {
    const { Client } = await import("../../models/index.js");
    const client = await Client.findByPk(tenantId, { transaction: t });
    if (client) {
      const updates = {};
      if (name  && client.name  !== name)  updates.name  = name;
      if (email && client.email !== email) updates.email = email;
      if (phone && client.phone !== phone) updates.phone = phone;
      if (Object.keys(updates).length) await client.update(updates, { transaction: t });
    }
  }

  // Upsert the Company detail record (branch/store level data)
  const row = {
    company_id: String(entityId),
    name,
    email,
    phone,
    address,
    is_active: data.is_active ?? true,
    clientId:  tenantId,
  };

  const existing = await Company.findOne({ where: { company_id: String(entityId) }, transaction: t });
  if (!existing) {
    await Company.create(row, { transaction: t });
  } else {
    await existing.update(row, { transaction: t });
  }
}

async function handleProduct(entityId, operation, data, tenantId, t) {
  const uuid = tenantEntityId(tenantId, entityId);
  if (operation === "DELETE") {
    await destroy(ErpProduct, uuid, t);
    return;
  }
  await upsert(ErpProduct, uuid, {
    clientId:   tenantId,
    name:       data.name,
    price:      data.price ?? data.selling_price ?? 0,
    barcode:    data.barcode ?? null,
    unit:       data.unit ?? null,
    categoryId: data.category_id ? tenantEntityId(tenantId, data.category_id) : null,
    stock:      data.current_stock ?? data.stock ?? 0,
    isActive:   data.is_active ?? true,
    rawData:    data,
    syncedAt:   new Date(),
  }, t);
}

async function handleCategory(entityId, operation, data, tenantId, t) {
  const uuid = tenantEntityId(tenantId, entityId);
  if (operation === "DELETE") {
    await destroy(ErpCategory, uuid, t);
    return;
  }
  await upsert(ErpCategory, uuid, {
    clientId: tenantId,
    name:     data.name,
    parentId: data.parent_id ? tenantEntityId(tenantId, data.parent_id) : null,
    syncedAt: new Date(),
  }, t);
}

async function handleSupplier(entityId, operation, data, tenantId, t) {
  const uuid = tenantEntityId(tenantId, entityId);
  if (operation === "DELETE") {
    await destroy(ErpSupplier, uuid, t);
    return;
  }
  await upsert(ErpSupplier, uuid, {
    clientId: tenantId,
    name:     data.name,
    phone:    data.phone ?? null,
    email:    data.email ?? null,
    balance:  data.balance ?? 0,
    syncedAt: new Date(),
  }, t);
}

async function handleCustomer(entityId, operation, data, tenantId, t) {
  const uuid = tenantEntityId(tenantId, entityId);
  if (operation === "DELETE") {
    await destroy(ErpCustomer, uuid, t);
    return;
  }
  await upsert(ErpCustomer, uuid, {
    clientId: tenantId,
    name:     data.name ?? data.full_name ?? "Unknown",
    phone:    data.phone ?? data.phoneNumber ?? null,
    email:    data.email ?? null,
    balance:  data.balance ?? 0,
    syncedAt: new Date(),
  }, t);
}

async function handleTransaction(entityId, operation, data, tenantId, t) {
  const uuid = tenantEntityId(tenantId, entityId);
  if (operation === "DELETE") {
    await destroy(ErpTransaction, uuid, t);
    return;
  }
  await upsert(ErpTransaction, uuid, {
    clientId:      tenantId,
    type:          data.type ?? null,
    amount:        data.amount ?? 0,
    paymentMethod: data.paymentMethod ?? data.payment_method ?? null,
    categoryId:    data.category_id ? tenantEntityId(tenantId, data.category_id) : null,
    accountId:     data.account_id  ? tenantEntityId(tenantId, data.account_id)  : null,
    notes:         data.notes ?? null,
    date:          data.date  ?? null,
    syncedAt:      new Date(),
  }, t);
}

async function handleSaleReturn(entityId, operation, data, tenantId, t) {
  if (operation === "DELETE") return;

  const originalSaleId = String(data.sale_id);

  const original = await SyncRecord.findOne({
    where: { tenantId, entityType: "sale", entityId: originalSaleId },
    transaction: t,
  });

  if (!original) return; // original sale not yet synced — will be updated on next sync

  const existingData = original.data || {};
  const returns = Array.isArray(existingData.returns) ? [...existingData.returns] : [];

  const newReturn = {
    return_id:      String(entityId),
    sale_id:        originalSaleId,
    date:           data.date ?? null,
    reason:         data.reason ?? null,
    total_refunded: data.total_refunded ?? 0,
    items:          data.items ?? [],
  };

  const idx = returns.findIndex((r) => String(r.return_id) === String(entityId));
  if (idx >= 0) returns[idx] = newReturn;
  else returns.push(newReturn);

  await original.update(
    { data: { ...existingData, returns } },
    { transaction: t },
  );
}

async function handleStockMovement(entityId, operation, data, tenantId, t) {
  // Stock movements are immutable — only create, never update/delete
  if (operation !== "CREATE") return;

  const uuid = tenantEntityId(tenantId, entityId);
  const exists = await ErpStockMovement.findByPk(uuid, { transaction: t });
  if (exists) return;

  await ErpStockMovement.create({
    id:          uuid,
    clientId:    tenantId,
    productId:   data.product_id ? tenantEntityId(tenantId, data.product_id) : null,
    type:        data.type ?? data.transaction_type ?? null,
    quantity:    data.quantity ?? 0,
    unitCost:    data.unit_cost ?? data.cost_price ?? null,
    referenceId: data.reference_id ? tenantEntityId(tenantId, data.reference_id) : null,
    notes:       data.notes ?? null,
    date:        data.date ?? null,
    syncedAt:    new Date(),
  }, { transaction: t });
}

// ─── Handler registry ─────────────────────────────────────────────────────────

const ENTITY_HANDLERS = {
  sale:              handleSale,
  company:           handleCompany,
  product:           handleProduct,
  category:          handleCategory,
  supplier:          handleSupplier,
  customer:          handleCustomer,
  transaction:       handleTransaction,
  stock_movement:       handleStockMovement,
  stock_batch:          handleStockMovement, // stock batches treated as movements
  sale_return:          handleSaleReturn,
  finance_account:      null,               // stored in sync_records only
  transaction_category: null,
  user:                 null,
};

// ─── Process a single sync item ───────────────────────────────────────────────

async function processSyncItem(item, tenantId, branchId) {
  const { queueId, entityType, entityId, operation, version, data } = item;
  const entityKey = entityType?.toLowerCase();

  const t = await sequelize.transaction();
  try {
    // Conflict detection
    const existing = await SyncRecord.findOne({
      where: { tenantId, entityType: entityKey, entityId: String(entityId) },
      transaction: t,
    });

    if (existing && existing.version > (version || 1)) {
      await t.rollback();
      return {
        queueId,
        status: "conflict",
        conflict: {
          localVersion:  version,
          remoteVersion: existing.version,
          remoteData:    existing.data,
          conflictDate:  new Date(),
        },
      };
    }

    // Run entity handler
    const handler = ENTITY_HANDLERS[entityKey];
    if (handler) {
      await handler(entityId, operation, data || {}, tenantId, t);
    }

    // Upsert audit record
    if (existing) {
      await existing.update(
        { operation, version: version || 1, data, queueId, status: "synced", receivedAt: new Date() },
        { transaction: t },
      );
    } else {
      await SyncRecord.create(
        {
          tenantId,
          branchId,
          entityType: entityKey,
          entityId:   String(entityId),
          operation,
          version:    version || 1,
          queueId,
          status:     "synced",
          data,
        },
        { transaction: t },
      );
    }

    await t.commit();
    return { queueId, status: "synced" };
  } catch (err) {
    await t.rollback();
    console.error(`[sync] processSyncItem failed [${entityKey}/${entityId}]:`, err.message);
    return { queueId, status: "failed", error: err.message };
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────────

/** Batch endpoint */
router.post("/batch", async (req, res, next) => {
  try {
    const { batch } = req.body;
    const { tenantId, branchId } = req.syncContext;

    if (!Array.isArray(batch) || batch.length === 0) {
      throw new AppError("batch must be a non-empty array", 400);
    }
    if (batch.length > 100) {
      throw new AppError("batch size exceeds maximum of 100", 400);
    }

    const results = await Promise.all(
      batch.map((item) => processSyncItem(item, tenantId, branchId)),
    );

    const summary = {
      total:     results.length,
      synced:    results.filter((r) => r.status === "synced").length,
      failed:    results.filter((r) => r.status === "failed").length,
      conflicts: results.filter((r) => r.status === "conflict").length,
    };

    res.status(200).json({ success: true, summary, results });
  } catch (err) {
    next(err);
  }
});

/** Single-item endpoint — backward compat */
router.post("/", async (req, res, next) => {
  try {
    const { entity, record_id, action, payload } = req.body;
    const { tenantId, branchId } = req.syncContext;

    if (!entity || !record_id || !action) {
      throw new AppError("entity, record_id and action are required", 400);
    }

    const result = await processSyncItem(
      { entityType: entity, entityId: record_id, operation: action.toUpperCase(), data: payload },
      tenantId,
      branchId,
    );

    if (result.status === "conflict") return res.status(409).json({ success: false, conflict: result.conflict });
    if (result.status === "failed")   return res.status(500).json({ success: false, error: result.error });

    res.status(200).json({ success: true, message: "Sync processed" });
  } catch (err) {
    next(err);
  }
});

/** Audit log */
router.get("/records", async (req, res, next) => {
  try {
    const { tenantId } = req.syncContext;
    const { page = 1, limit = 20, entityType } = req.query;

    const where = { tenantId };
    if (entityType) where.entityType = entityType;

    const { rows, count } = await SyncRecord.findAndCountAll({
      where,
      order: [["received_at", "DESC"]],
      limit:  parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.json({ data: rows, total: count, page: parseInt(page) });
  } catch (err) {
    next(err);
  }
});

/** Pull endpoint — ERP calls this to fetch its synced data back from Admin */
router.get("/pull", async (req, res, next) => {
  try {
    const { tenantId } = req.syncContext;

    const [products, categories, suppliers, customers] = await Promise.all([
      ErpProduct.findAll({ where: { clientId: tenantId }, order: [["syncedAt", "DESC"]] }),
      ErpCategory.findAll({ where: { clientId: tenantId } }),
      ErpSupplier.findAll({ where: { clientId: tenantId } }),
      ErpCustomer.findAll({ where: { clientId: tenantId } }),
    ]);

    res.json({ products, categories, suppliers, customers });
  } catch (err) {
    next(err);
  }
});

export { router };
