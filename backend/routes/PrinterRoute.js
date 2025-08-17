const express = require("express");
const router = express.Router();
const pdf2printer = require("pdf-to-printer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { GetProductByIdOrBarcode } = require("../services/ProductService");
const { getSaleById } = require("../services/SaleService");

// Using pdf-to-printer
router.post("/label-print", async (req, res) => {
  try {
    const { barcode } = req.body;
    if (!barcode) {
      return res.status(400).json({ error: "Barcode is required" });
    }
    const product = await GetProductByIdOrBarcode(barcode);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const mmToPt = (mm) => (mm / 25.4) * 72;
    const width = mmToPt(58.4);
    const height = mmToPt(38.2);

    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempPath = path.join(tempDir, `label_${Date.now()}.pdf`);

    // Create PDF
    const doc = new PDFDocument({
      size: [width, height],
      margin: 0,
    });

    doc.registerFont("Inter", "./utils/fonts/Inter.ttf");

    // ...existing code...
    const productName = product.name || "Ürün Adı";
    const priceText = `${product.sellPrice} ₼` || "Fiyat Bilgisi";
    const nameFontSize = 14;
    const priceFontSize = 24;
    const maxCharsPerLine = 18;

    // Word wrap: kelime bölmeden satırları oluştur
    function wrapWords(str, maxLen) {
      const words = str.split(" ");
      const lines = [];
      let line = "";
      words.forEach((word) => {
        if ((line + (line ? " " : "") + word).length <= maxLen) {
          line += (line ? " " : "") + word;
        } else {
          if (line) lines.push(line);
          line = word;
        }
      });
      if (line) lines.push(line);
      return lines;
    }

    const nameLines = wrapWords(productName, maxCharsPerLine);

    // Calculate total height for all name lines and price
    doc.font("Inter").fontSize(nameFontSize);
    const nameLineHeight = doc.currentLineHeight();
    const totalNameHeight = nameLineHeight * nameLines.length;

    doc.font("Inter").fontSize(priceFontSize);
    const priceHeight = doc.currentLineHeight();

    const totalHeight = totalNameHeight + priceHeight + 2;
    const startY = (height - totalHeight) / 2;

    // Write product name lines, centered
    doc.font("Inter").fontSize(nameFontSize);
    let y = startY;
    nameLines.forEach((line) => {
      const lineWidth = doc.widthOfString(line);
      doc.text(line, (width - lineWidth) / 2, y);
      y += nameLineHeight;
    });

    // Write price, centered
    doc.font("Inter").fontSize(priceFontSize);
    const priceWidth = doc.widthOfString(priceText);
    doc.text(priceText, (width - priceWidth) / 2, y + 4);
    // ...existing code...

    // Save PDF to file
    const stream = fs.createWriteStream(tempPath);
    doc.pipe(stream);
    doc.end();

    // Wait for PDF to be written, then print
    stream.on("finish", async () => {
      try {
        // Print using pdf-to-printer with exact size settings
        const options = {
          printer: "Xprinter XP-350B", // Your thermal printer
          pages: "1",
          orientation: "landscape",
          scale: "noscale", // Critical: No scaling
          monochrome: false,
          silent: true,
          printDialog: false,
          copies: 1,
          // For thermal printers, these are the key settings:
          paperSize: "Custom", // Use custom paper size
          fit: "actualsize", // Print at actual PDF size
        };

        console.log("Printing with options:", options);
        await pdf2printer.print(tempPath, options);

        // Clean up temp file
        fs.unlinkSync(tempPath);

        console.log("PDF printed successfully");
        res.json({ success: true, message: "PDF printed successfully" });
      } catch (printError) {
        console.error("Print error:", printError);
        // Clean up temp file even on error
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
        res.status(500).json({
          error: "Print failed",
          details: printError.message,
        });
      }
    });

    stream.on("error", (streamError) => {
      console.error("PDF creation error:", streamError);
      res.status(500).json({
        error: "Failed to create PDF",
        details: streamError.message,
      });
    });
  } catch (error) {
    console.error("General error:", error);
    res.status(500).json({
      error: "Failed to create and print PDF",
      details: error.message,
    });
  }
});

// Get available printers
router.get("/printers", async (req, res) => {
  try {
    const printers = await pdf2printer.getPrinters();
    res.json({ printers: printers });
  } catch (error) {
    console.error("Error getting printers:", error);
    res.status(500).json({
      error: "Could not get printers list",
      details: error.message,
    });
  }
});

// Test route to check PDF dimensions
router.get("/test-dimensions", (req, res) => {
  const mmToPt = (mm) => (mm / 25.4) * 72;
  const width = mmToPt(58.4);
  const height = mmToPt(38.2);

  res.json({
    dimensions: {
      points: { width: width, height: height },
      mm: { width: 58.4, height: 38.2 },
      inches: { width: 58.4 / 25.4, height: 38.2 / 25.4 },
    },
    message: "These are the exact dimensions your PDF will be printed at",
  });
});

router.get("/sale-receipt/:id", async (req, res, next) => {
  try {
    const sale = await getSaleById(req.params.id);
    if (!sale) return res.status(404).json({ error: "Sale not found" });

    const mmToPt = (mm) => (mm / 25.4) * 72;
    const width = mmToPt(75);
    const margin = 0;
    const lineHeight = 12;
    const fontSize = 10;
    const boldFontSize = 10;
    const maxCharsPerLine = 12;

    // Column positions - better distributed
    const col = {
      name: margin,
      qty: width - 90,
      price: width - 35,
      total: width - 2,
    };

    // Calculate dynamic height more accurately
    let totalProductLines = 0;
    sale.details.forEach((item) => {
      const nameLines = Math.ceil(item.name.length / maxCharsPerLine);
      totalProductLines += nameLines;
    });

    const headerHeight = 65;
    const productHeight =
      totalProductLines * lineHeight + sale.details.length * 1;
    const footerHeight = 35;
    const dynamicHeight = headerHeight + productHeight + footerHeight;

    // Temp PDF path
    const tempDir = path.join(__dirname, "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    const tempPath = path.join(tempDir, `receipt_${Date.now()}.pdf`);

    const doc = new PDFDocument({
      size: [width, dynamicHeight + 40],
      margin,
    });

    doc.registerFont("Inter", path.join(__dirname, "../utils/fonts/Inter.ttf"));
    doc.font("Inter");

    let currentY = margin;

    // === Header ===
    doc.fontSize(boldFontSize + 2);
    doc.text("Rauf Market", margin, currentY, {
      align: "center",
      width: width - 2 * margin,
    });
    currentY += lineHeight + 5;

    doc.fontSize(8).text("Satiş çeki", margin, currentY, {
      align: "center",
      width: width - 2 * margin,
    });
    currentY += lineHeight + 5;

    doc.fontSize(fontSize);
    doc.text(`Tarix: ${sale.date}`, margin, currentY);
    currentY += lineHeight;

    doc.text(`Çek No: ${sale?.saleId}`, margin, currentY);
    currentY += lineHeight + 3;

    // Header line
    doc
      .moveTo(margin, currentY)
      .lineTo(width - margin, currentY)
      .stroke();
    currentY += 5;

    // === Table Header ===
    doc.fontSize(fontSize);
    doc.text("Məhsul", col.name, currentY);
    doc.text("Qiymət", col.price - 46, currentY);
    doc.text("Miqdar", col.qty - 36, currentY);
    doc.text("Məbləğ", col.total - 35, currentY);
    currentY += lineHeight + 2;

    doc
      .moveTo(margin, currentY)
      .lineTo(width - margin, currentY)
      .stroke();
    currentY += 3;

    // === Product List ===
    doc.fontSize(fontSize);

    sale.details.forEach((item) => {
      const nameLines = Math.ceil(item.name.length / maxCharsPerLine);
      let itemStartY = currentY;

      for (let i = 0; i < nameLines; i++) {
        const start = i * maxCharsPerLine;
        const textLine = item.name.substring(start, start + maxCharsPerLine);

        doc.text(textLine, col.name, currentY);

        // Only show qty, price, total on first line of product
        if (i === 0) {
          // Right align numbers
          const priceText = item.sellPrice.toString() + " ₼";
          const qtyText = item.quantity.toString();
          const totalText = item.subtotal.toString() + " ₼";

          const qtyWidth = doc.widthOfString(qtyText);
          const priceWidth = doc.widthOfString(priceText);
          const totalWidth = doc.widthOfString(totalText);

          doc.text(priceText, col.price - priceWidth - 10, itemStartY);
          doc.text(qtyText, col.qty - qtyWidth - 10, itemStartY);
          doc.text(totalText, col.total - totalWidth, itemStartY);
        }

        currentY += lineHeight;
      }
      currentY += 2; // Small gap between products
    });

    // === Footer ===
    currentY += 3;
    doc
      .moveTo(margin, currentY)
      .lineTo(width - margin, currentY)
      .stroke();
    currentY += 8;

    // Total (right aligned)
    doc.fontSize(boldFontSize + 5);
    const totalText = `Cəmi: ${sale.totalAmount} ₼`;
    const totalWidth = doc.widthOfString(totalText);
    doc.text(totalText, width - margin - totalWidth, currentY);
    currentY += boldFontSize + 8;

    // doc.pipe(res);
    // doc.end();
    // Save PDF to file
    const stream = fs.createWriteStream(tempPath);
    doc.pipe(stream);
    doc.end();

    stream.on("finish", async () => {
      try {
        // Print using pdf-to-printer

        const options = {
          printer: "XP-80C", // kendi yazıcınızın adı
          pages: "1",
          orientation: "portrait", // fiş yatay
          scale: "noscale", // Ölçeklendirme
          monochrome: false,
          silent: true,
          printDialog: false,
          copies: 1,
          paperSize: "Custom",
          fit: "actualsize",
        };

        await pdf2printer.print(tempPath, options);

        // Temizle
        fs.unlinkSync(tempPath);

        res.json({ success: true, message: "Fiş yazıcıya gönderildi" });
      } catch (printError) {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        res.status(500).json({
          error: "Yazdırma başarısız",
          details: printError.message,
        });
      }
    });

    stream.on("error", (streamError) => {
      res.status(500).json({
        error: "PDF oluşturulamadı",
        details: streamError.message,
      });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
