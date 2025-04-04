const express = require("express");
const bodyParser = require("body-parser");
const { createCanvas, loadImage } = require("canvas");
const escpos = require("escpos");
const fs = require("fs");
const path = require("path");
const bwipjs = require("bwip-js");
const router = express.Router();
const printJobs = []; // Store print jobs in memory

// Mock Printer Class
class VirtualPrinter {
  constructor() {
    this.jobs = [];
  }

  print(text) {
    const job = {
      id: Date.now(),
      content: text,
      timestamp: new Date(),
      status: "queued",
    };
    this.jobs.push(job);
    return job;
  }

  getJobStatus(id) {
    return this.jobs.find((job) => job.id === id)?.status || "not_found";
  }
}

const virtualPrinter = new VirtualPrinter();

// Enhanced Preview Generator
router.post("/preview-html", async (req, res) => {
  const {
    text = "Sample Text",
    barcode,
    barcodeType = "code128",
    fontSize = 24,
    fontFamily = "Arial",
    width = 464,
    height = 300,
  } = req.body;

  try {
    let barcodeImageBase64 = "";

    // Barkod oluştur
    if (barcode) {
      try {
        const barcodeBuffer = await bwipjs.toBuffer({
          bcid: barcodeType,
          text: barcode,
          scale: 3,
          height: 10,
          includetext: false, // Metni dahil etme, HTML'de ekleyeceğiz
        });

        // Buffer'ı base64'e çevir
        barcodeImageBase64 = barcodeBuffer.toString("base64");
      } catch (barcodeError) {
        console.error("Barcode error:", barcodeError);
        barcodeImageBase64 = "";
      }
    }

    // Barkod sayılarını formatlı hale getir (aralarında boşluk)
    const formattedBarcode = barcode ? barcode.split("").join(" ") : "";

    // HTML içeriğini oluştur
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Barkod Önizleme</title>
      <style>
        .label-container {
          width: ${width}px;
          height: ${height}px;
          border: 1px solid #ccc;
          padding: 10px;
          background: white;
          font-family: ${fontFamily}, sans-serif;
        }
        
        .label-header {
          text-align: center;
          margin-bottom: 20px;
          font-size: ${fontSize}px;
        }
        
        .barcode-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .barcode-image {
          max-width: 100%;
          height: auto;
        }
        
        .barcode-text {
          font-family: monospace;
          font-size: 18px;
          letter-spacing: 5px;
          margin-top: 10px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="label-container">
        <div class="label-header">
          <h2>${text}</h2>
        </div>
        <div class="barcode-container">
          ${
            barcodeImageBase64
              ? `<img src="data:image/png;base64,${barcodeImageBase64}" alt="Barcode" class="barcode-image" />`
              : "<div>Barkod oluşturulamadı</div>"
          }
          <div class="barcode-text">${formattedBarcode}</div>
        </div>
      </div>
    </body>
    </html>
    `;

    // HTML içeriğini gönder
    res.type("html").send(html);
  } catch (error) {
    console.error("Preview error:", error);
    res.status(500).send({ error: "Preview generation failed" });
  }
});

// Print Job Simulation
router.post("/print", async (req, res) => {
  const { text, options } = req.body;

  try {
    // Store in virtual print queue
    const job = virtualPrinter.print(text);

    // Simulate printing delay
    setTimeout(() => {
      job.status = "completed";
      // Optional: Save to file
      const filename = `print-job-${job.id}.txt`;
      fs.writeFileSync(path.join(__dirname, "prints", filename), text);
    }, 2000);

    res.send({
      success: true,
      jobId: job.id,
      message: "Print job queued (virtual mode)",
    });
  } catch (error) {
    res.status(500).send({ error: "Print failed" });
  }
});

// Get Print Job Status
router.get("/job-status/:id", (req, res) => {
  const status = virtualPrinter.getJobStatus(Number(req.params.id));
  res.send({ status });
});

// Get All Print Jobs
router.get("/jobs", (req, res) => {
  res.send(virtualPrinter.jobs);
});

// Handle JSON parse errors
router.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("JSON Parse Error:", err);
    return res.status(400).json({
      error: "Invalid JSON format",
      message: "Please check your request body formatting",
      details: {
        required_format: {
          text: "string",
        },
        example: {
          text: "Sample label content",
        },
      },
    });
  }
  next();
});

module.exports = router;
