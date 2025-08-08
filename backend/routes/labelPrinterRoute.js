const express = require("express");
const router = express.Router();
// const JsBarcode = require('jsbarcode');
// const { createCanvas } = require('canvas');
// const fs = require('fs').promises;
// const path = require('path');

// // Convert cm to points (1 cm = 28.3465 points)
// const CM_TO_POINTS = 28.3465;

// // GET route to create and download a PDF file with Name and Barcode
// router.get('/generate-pdf', async (req, res) => {
//   try {
//     // Extract parameters from query
//     const { fileName = 'output.pdf', data: dataString } = req.query;

//     // Parse data from query string, fallback to default
//     let data = [{ Name: "Ismo", Barcode: "545145" }];
//     if (dataString) {
//       try {
//         data = JSON.parse(dataString);
//       } catch (error) {
//         return res.status(400).json({ error: "Invalid data format in query parameter" });
//       }
//     }

//     // Default columnWidths and rowHeights
//     const columnWidths = [2.8, 3]; // In cm
//     const rowHeights = data.length > 1 ? Array(data.length).fill(4 / data.length) : [4]; // Dynamic row heights

//     // Validate input
//     if (!data || !Array.isArray(data) || data.length === 0) {
//       return res
//         .status(400)
//         .json({ error: "Data array is required and must not be empty" });
//     }
//     if (!data.every((row) => "Name" in row && "Barcode" in row)) {
//       return res
//         .status(400)
//         .json({ error: "Each data row must contain Name and Barcode fields" });
//     }
//     if (!Array.isArray(columnWidths) || columnWidths.length !== 2) {
//       return res.status(400).json({ error: "columnWidths must be an array of 2 numbers" });
//     }
//     if (!Array.isArray(rowHeights) || rowHeights.length === 0) {
//       return res.status(400).json({ error: "rowHeights must be an array of numbers" });
//     }

//     // Create a new PDF document with custom page size (4cm x 5.8cm)
//     const doc = new PDFDocument({
//       size: [5.8 * CM_TO_POINTS, 4 * CM_TO_POINTS], // Width: 5.8cm, Height: 4cm
//       margin: 5 // Small margin in points
//     });

//     // Set response headers for PDF download
//     res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
//     res.setHeader('Content-Type', 'application/pdf');

//     // Pipe PDF to response
//     doc.pipe(res);

//     // Font settings
//     doc.font('Helvetica').fontSize(8);

//     // Calculate column widths in points
//     const totalWidth = 5.8 * CM_TO_POINTS - 10; // Subtract margins
//     const colWidths = columnWidths.map(w => w * CM_TO_POINTS);

//     // Calculate row heights in points
//     const totalHeight = 4 * CM_TO_POINTS - 10; // Subtract margins
//     const rowHeight = Math.min(rowHeights[0] * CM_TO_POINTS, totalHeight / data.length);

//     // Temporary files for barcodes
//     const tempFiles = [];

//     // Add data to PDF
//     let y = 5; // Start Y position (margin)
//     for (let i = 0; i < data.length; i++) {
//       const row = data[i];
//       let x = 5; // Start X position (margin)

//       // Add Name (text)
//       doc.text(row.Name || '', x, y, {
//         width: colWidths[0],
//         height: rowHeight,
//         align: 'left',
//         ellipsis: true
//       });

//       // Add Barcode (image)
//       if (row.Barcode) {
//         // Generate barcode
//         const canvas = createCanvas(100, 50);
//         JsBarcode(canvas, row.Barcode, {
//           format: 'CODE128',
//           width: 1,
//           height: 40,
//           displayValue: true,
//           fontSize: 6
//         });

//         // Save barcode image temporarily
//         const barcodeImagePath = path.join(__dirname, `barcode_${i}.png`);
//         const buffer = canvas.toBuffer('image/png');
//         await fs.writeFile(barcodeImagePath, buffer);
//         tempFiles.push(barcodeImagePath);

//         // Add barcode image to PDF
//         doc.image(barcodeImagePath, x + colWidths[0], y, {
//           width: colWidths[1],
//           height: rowHeight * 0.8
//         });
//       }

//       y += rowHeight;
//       if (y + rowHeight > 4 * CM_TO_POINTS - 5) break; // Stop if exceeding page height
//     }

//     // Finalize PDF
//     doc.end();

//     // Clean up temporary barcode image files
//     for (const file of tempFiles) {
//       try {
//         await fs.unlink(file);
//       } catch (err) {
//         console.error(`Failed to delete temporary file ${file}:`, err);
//       }
//     }
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     res.status(500).json({ error: 'Failed to generate PDF file' });
//   }
// });

module.exports = router;
