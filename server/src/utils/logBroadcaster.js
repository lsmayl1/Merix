import { WebSocketServer } from "ws";
import { verifyToken } from "./Jwt.js";
import { User } from "../models/index.js";
import url from "url";

const BUFFER_SIZE = 500;
const logBuffer = [];
const clients = new Set();

function formatEntry(level, args) {
  const msg = args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ");
  return JSON.stringify({ ts: new Date().toISOString(), level, msg });
}

function broadcast(entry) {
  logBuffer.push(entry);
  if (logBuffer.length > BUFFER_SIZE) logBuffer.shift();
  for (const ws of clients) {
    if (ws.readyState === 1) ws.send(entry);
  }
}

const _log   = console.log.bind(console);
const _error = console.error.bind(console);
const _warn  = console.warn.bind(console);

console.log   = (...args) => { _log(...args);   broadcast(formatEntry("info",  args)); };
console.error = (...args) => { _error(...args); broadcast(formatEntry("error", args)); };
console.warn  = (...args) => { _warn(...args);  broadcast(formatEntry("warn",  args)); };

export function attachLogSocket(server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", async (req, socket, head) => {
    const { pathname, query } = url.parse(req.url, true);
    if (pathname !== "/ws/logs") return socket.destroy();

    const payload = verifyToken(query.token, "access");
    if (!payload) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      return socket.destroy();
    }

    const user = await User.findByPk(payload.userId, { attributes: ["role"] });
    if (!user || user.role !== "admin") {
      socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
      return socket.destroy();
    }

    wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws));
  });

  wss.on("connection", (ws) => {
    clients.add(ws);
    for (const entry of logBuffer) {
      if (ws.readyState === 1) ws.send(entry);
    }
    ws.on("close", () => clients.delete(ws));
    ws.on("error", () => clients.delete(ws));
  });
}
