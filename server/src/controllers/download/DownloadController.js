import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOWNLOADS_DIR = path.join(__dirname, "../../../../downloads");
const INSTALLER_NAME = "MerixSetup.exe";

export const router = express.Router();

/* GET /api/download/info  — version + size, no auth required */
router.get("/info", (req, res) => {
  const filePath = path.join(DOWNLOADS_DIR, INSTALLER_NAME);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ available: false, message: "Installer not uploaded yet." });
  }

  const stat = fs.statSync(filePath);
  const sizeMB = (stat.size / 1024 / 1024).toFixed(1);

  res.json({
    available: true,
    fileName: INSTALLER_NAME,
    sizeMB: parseFloat(sizeMB),
    sizeBytes: stat.size,
    updatedAt: stat.mtime,
  });
});

/* GET /api/download/installer  — streams the exe, no auth required */
router.get("/installer", (req, res) => {
  const filePath = path.join(DOWNLOADS_DIR, INSTALLER_NAME);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Installer not available yet." });
  }

  const stat = fs.statSync(filePath);

  res.setHeader("Content-Disposition", `attachment; filename="${INSTALLER_NAME}"`);
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Length", stat.size);

  // Support range requests so downloads can resume
  const range = req.headers.range;
  if (range) {
    const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : stat.size - 1;
    const chunkSize = end - start + 1;

    res.status(206);
    res.setHeader("Content-Range", `bytes ${start}-${end}/${stat.size}`);
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Content-Length", chunkSize);

    fs.createReadStream(filePath, { start, end }).pipe(res);
  } else {
    res.setHeader("Accept-Ranges", "bytes");
    fs.createReadStream(filePath).pipe(res);
  }
});
