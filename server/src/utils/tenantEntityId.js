import crypto from "crypto";

/**
 * Generates a stable, deterministic UUID-v5-style string from a tenantId + entityId pair.
 * Same inputs always produce the same UUID, so re-syncing the same ERP record
 * upserts the existing row rather than creating a duplicate.
 */
export function tenantEntityId(tenantId, entityId) {
  const hash = crypto
    .createHash("sha1")
    .update(`${tenantId}:${String(entityId)}`)
    .digest("hex");

  // Format as xxxxxxxx-xxxx-5xxx-yxxx-xxxxxxxxxxxx  (v5-like, variant 10xx)
  const variant = ((parseInt(hash.slice(16, 18), 16) & 0x3f) | 0x80)
    .toString(16)
    .padStart(2, "0");

  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    `5${hash.slice(13, 16)}`,
    `${variant}${hash.slice(18, 20)}`,
    hash.slice(20, 32),
  ].join("-");
}
