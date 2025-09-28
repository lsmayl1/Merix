import { verifyToken } from "../utils/Jwt.js";

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2)
    return res.status(401).json({ error: "Invalid token format" });

  const token = parts[1];
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.userId, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
export { authenticate };