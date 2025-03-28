const express = require("express");
const router = express.Router();
const { createCanvas, loadImage } = require("canvas");
const bwipjs = require("bwip-js");

// Configurable parameters
const LABEL_CONFIG = {
  width: 141, // 50mm in pixels (1mm ≈ 2.8346px)
  height: 85, // 30mm in pixels
  padding: 10,
  backgroundColor: "white",
  textColor: "black",
  barcodeHeight: 25,
  barcodeWidth: 120,
  textFont: "bold 12px Arial",
  barcodeFont: "10px Arial",
};

async function generateBarcodeImage(barcodeText) {
  return new Promise((resolve, reject) => {
    bwipjs.toBuffer(
      {
        bcid: "code128",
        text: barcodeText,
        scale: 2,
        height: LABEL_CONFIG.barcodeHeight,
        includetext: false,
        textxalign: "center",
      },
      (err, buffer) => {
        if (err) reject(err);
        else resolve(buffer);
      }
    );
  });
}

async function createLabelImage(text, barcode) {
  const canvas = createCanvas(LABEL_CONFIG.width, LABEL_CONFIG.height);
  const ctx = canvas.getContext("2d");

  // Draw background
  ctx.fillStyle = LABEL_CONFIG.backgroundColor;
  ctx.fillRect(0, 0, LABEL_CONFIG.width, LABEL_CONFIG.height);

  // Draw text
  ctx.fillStyle = LABEL_CONFIG.textColor;
  ctx.font = LABEL_CONFIG.textFont;
  ctx.textAlign = "center";
  ctx.fillText(text, LABEL_CONFIG.width / 2, 15);

  // Generate and draw barcode
  try {
    const barcodeBuffer = await generateBarcodeImage(barcode);
    const barcodeImage = await loadImage(barcodeBuffer);

    ctx.drawImage(
      barcodeImage,
      LABEL_CONFIG.padding,
      20,
      LABEL_CONFIG.barcodeWidth,
      LABEL_CONFIG.height - 40
    );

    // Draw barcode numbers
    ctx.font = LABEL_CONFIG.barcodeFont;
    ctx.textAlign = "left";
    ctx.fillText(barcode, LABEL_CONFIG.padding, LABEL_CONFIG.height - 5);

    return canvas.toBuffer("image/png");
  } catch (error) {
    throw new Error(`Barcode generation failed: ${error.message}`);
  }
}

router.post("/print-label", async (req, res) => {
  try {
    const { text = "Default Label Text", barcode = "654575465465" } = req.body;

    if (!barcode.match(/^[0-9]+$/)) {
      return res
        .status(400)
        .json({ error: "Barcode must contain only numbers" });
    }

    const imageBuffer = await createLabelImage(text, barcode);

    res.set("Content-Type", "image/png");
    res.send(imageBuffer);
  } catch (error) {
    console.error("Label generation error:", error);
    res.status(500).json({
      error: "Label generation failed",
      details: error.message,
    });
  }
});

module.exports = router;
