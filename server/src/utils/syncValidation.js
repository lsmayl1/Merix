/**
 * Integrity validation for incoming sync payloads.
 *
 * A record must be complete and consistent before it is committed. Invalid
 * records are rejected (not acknowledged) so the sender re-requests them
 * rather than persisting partial or corrupt data.
 *
 * validateSyncPayload returns { valid: true } or { valid: false, reason }.
 */

// Present and numeric (0 is valid; null / undefined / "" are not).
const num = (v) => v !== null && v !== undefined && v !== "" && !Number.isNaN(Number(v));

// Present and non-empty string-ish.
const str = (v) => v !== null && v !== undefined && String(v).trim().length > 0;

const RULES = {
  product:        (d) => (str(d.name) ? true : "product.name is required"),
  category:       (d) => (str(d.name) ? true : "category.name is required"),
  supplier:       (d) => (str(d.name) ? true : "supplier.name is required"),
  customer:       (d) => (str(d.name) || str(d.full_name) ? true : "customer.name is required"),
  transaction:    (d) => (num(d.amount) ? true : "transaction.amount is required"),
  stock_movement: (d) => (num(d.quantity) ? true : "stock_movement.quantity is required"),
  stock_batch:    (d) => (num(d.quantity) ? true : "stock_batch.quantity is required"),
  sale:           (d) => (num(d.totalAmount ?? d.total_amount) ? true : "sale.total_amount is required"),
  company:        (d) => (str(d.name) || str(d.company_name) ? true : "company.name is required"),
  sale_return:    (d) => (str(d.sale_id) ? true : "sale_return.sale_id is required"),
};

export function validateSyncPayload(entityType, operation, entityId, data) {
  if (entityId === null || entityId === undefined || entityId === "") {
    return { valid: false, reason: "entityId is required" };
  }

  const op = String(operation || "").toUpperCase();

  // Deletes only need a valid id; the payload may legitimately be minimal.
  if (op === "DELETE") return { valid: true };

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { valid: false, reason: "payload data is missing or malformed" };
  }

  const rule = RULES[entityType];
  if (!rule) return { valid: true }; // unknown / audit-only entities pass

  const result = rule(data);
  return result === true
    ? { valid: true }
    : { valid: false, reason: typeof result === "string" ? result : `${entityType} failed validation` };
}
