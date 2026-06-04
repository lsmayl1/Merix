import { verifyToken } from "../utils/Jwt.js";

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token, "access");

  if (!payload) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }

  req.user = { id: payload.userId, role: payload.role };
  next();
}

export { authenticate };