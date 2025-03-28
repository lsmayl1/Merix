const express = require("express");
const { body, param, validationResult } = require("express-validator");
const router = express.Router();
const { Products, Sequelize, sequelize, Op } = require("../models");

// Validation middleware for POST
// const validateProduct = [
//   body("name")
//     .notEmpty()
//     .withMessage("Name is required")
//     .isString()
//     .withMessage("Name must be a string"),
//   body("category")
//     .notEmpty()
//     .withMessage("Category is required")
//     .isString()
//     .withMessage("Category must be a string"),
//   body("barcode")
//     .notEmpty()
//     .withMessage("Barcode is required")
//     .isNumeric()
//     .withMessage("Barcode must consist of numbers only")
//     .isString()
//     .withMessage("Barcode must be a string")
//     .custom((value, { req }) => {
//       if (req.body.unit === "kg") {
//         if (!value.startsWith("22")) {
//           throw new Error('Barcode must start with "22" when unit is "kg"');
//         }
//         if (value.length !== 13) {
//           throw new Error(
//             'Barcode must be exactly 13 digits when unit is "kg"'
//           );
//         }
//       }
//       return true;
//     }),
//   body("buyPrice")
//     .notEmpty()
//     .withMessage("Buy price is required")
//     .isFloat({ min: 0 })
//     .withMessage("Buy price must be a positive number"),
//   body("sellPrice")
//     .notEmpty()
//     .withMessage("Sell price is required")
//     .isFloat({ min: 0 })
//     .withMessage("Sell price must be a positive number"),
//   body("unit")
//     .notEmpty()
//     .withMessage("Unit is required")
//     .isIn(["piece", "kg"])
//     .withMessage('Unit must be either "piece" or "kg"'),
// ];

// // Validation for PUT
// const validateUpdateProduct = [
//   body("name").optional().isString().withMessage("Name must be a string"),
//   body("category")
//     .optional()
//     .isString()
//     .withMessage("Category must be a string"),
//   body("buyPrice")
//     .optional()
//     .isFloat({ min: 0 })
//     .withMessage("Buy price must be a positive number"),
//   body("sellPrice")
//     .optional()
//     .isFloat({ min: 0 })
//     .withMessage("Sell price must be a positive number"),
//   body("unit")
//     .optional()
//     .isIn(["piece", "kg"])
//     .withMessage('Unit must be either "piece" or "kg"'),
//   body("barcode")
//     .optional()
//     .isNumeric()
//     .withMessage("Barcode must consist of numbers only")
//     .isString()
//     .withMessage("Barcode must be a string")
//     .custom(async (value, { req }) => {
//       const product = await Products.findByPk(req.params.id);
//       const unitToCheck = req.body.unit || product.unit;
//       if (unitToCheck === "kg") {
//         if (value && !value.startsWith("22")) {
//           throw new Error('Barcode must start with "22" when unit is "kg"');
//         }
//         if (value && value.length !== 13) {
//           throw new Error(
//             'Barcode must be exactly 13 digits when unit is "kg"'
//           );
//         }
//       }
//       return true;
//     }),
// ];

// Error handling middleware
// const handleValidationErrors = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   next();
// };

// Create a product
router.post("/", async (req, res) => {
  try {
    const { name, barcode, sellPrice, buyPrice, unit, category } = req.body;

    // Zorunlu alanları kontrol et
    if (!name || !unit || !category) {
      return res.status(400).json({ message: "Ad, unit veya kategori eksik" });
    }

    // Unit’in geçerli bir ENUM değeri olduğundan emin ol
    if (!["piece", "kg"].includes(unit)) {
      return res.status(400).json({ message: 'Unit "piece" veya "kg" olmalı' });
    }

    if (!barcode) {
      return res.status(401).json({ message: "Barkod yoxdur" });
    }
    // Barkodun uzunluğunu kontrol et (isteğe bağlı, 13 hane istiyorsanız)
    if (barcode && unit === "kg" && barcode.length !== 13) {
      return res.status(400).json({
        message:
          "Kg vahidli mehsullarin barokdu 22 le baslamali uzunluqu 13 reqemden ibaret olmalidir",
      });
    }

    // Veri türlerini düzenle
    const productData = {
      name,
      barcode: barcode || null, // Barkod opsiyonel
      sellPrice: sellPrice ? parseFloat(sellPrice) : null, // DECIMAL için sayı
      buyPrice: buyPrice ? parseFloat(buyPrice) : null, // DECIMAL için sayı
      unit,
      category,
    };

    const product = await Products.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error("Hata:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Doğrulama hatası",
        errors: error.errors.map((e) => e.message),
      });
    } else if (error.barcode === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Bu barkod zaten kullanılıyor" });
    }
    res.status(400).json({ error: error.message });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Products.findAll();

    // Veriyi dönüştür
    const transformedProducts = products.map((product) => {
      return {
        ...product.toJSON(),
        buyPrice: parseFloat(product.buyPrice),
        sellPrice: parseFloat(product.sellPrice),
      };
    });

    res.json(transformedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a product by ID or barcode
router.get("/:id", async (req, res) => {
  try {
    let product;
    const param = req.params.id;

    // Önce ID ile ara (eğer param bir tam sayıysa)
    if (!isNaN(param)) {
      product = await Products.findByPk(Number(param));
    }

    // ID ile ürün bulunamadıysa, barkod ile ara
    if (!product) {
      product = await Products.findOne({ where: { barcode: param } });
    }

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found by ID or barcode" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a product
router.put("/:id", async (req, res) => {
  try {
    // Find product by ID (as a number) or barcode (as a string)
    let product = null;

    // Try ID first (convert to number if it’s numeric)
    if (!isNaN(req.params.id)) {
      product = await Products.findByPk(Number(req.params.id));
    }

    // If not found by ID, try barcode
    if (!product) {
      product = await Products.findOne({ where: { barcode: req.params.id } });
    }

    // If no product found, send error
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // List of fields we can update
    const fields = [
      "name",
      "category",
      "buyPrice",
      "sellPrice",
      "unit",
      "barcode",
    ];

    // Build update data from request
    const updateData = {};
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Check if barcode is already used
    if (updateData.barcode && updateData.barcode !== product.barcode) {
      const barcodeCheck = await Products.findOne({
        where: { barcode: updateData.barcode },
      });
      if (barcodeCheck && barcodeCheck.id !== product.id) {
        return res.status(400).json({ error: "Barcode already in use" });
      }
    }

    // Update product and send result
    await product.update(updateData);
    return res.json(product);
  } catch (error) {
    // Show error in logs and send simple message
    console.error("Error:", error.message);
    return res.status(500).json({ error: "Failed to update product" });
  }
});
// Delete a product
router.delete(
  "/:id",
  // validateIdOrBarcode,

  async (req, res) => {
    try {
      let product = null;
      if (!isNaN(req.params.id)) {
        product = await Products.findByPk(Number(req.params.id));
      }

      // If not found by ID, try barcode
      if (!product) {
        product = await Products.findOne({ where: { barcode: req.params.id } });
      }

      // If no product found, send error
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (product) {
        await product.destroy();
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post("/generate-barcode", async (req, res) => {
  try {
    const { unit } = req.body;

    if (!unit || !["piece", "kg"].includes(unit)) {
      return res.status(400).json({
        message: 'Geçersiz veya eksik unit değeri. "piece" veya "kg" olmalı.',
      });
    }

    const existingBarcodes = (
      await Products.findAll({ attributes: ["barcode"] })
    ).map((p) => p.barcode);

    let newBarcodeBase; // 12 haneli temel barkod
    let newBarcode; // 13 haneli son barkod

    const calculateCheckDigit = (barcode) => {
      const digits = barcode.split("").map(Number);
      const evenSum =
        digits[1] + digits[3] + digits[5] + digits[7] + digits[9] + digits[11];
      const oddSum =
        digits[0] + digits[2] + digits[4] + digits[6] + digits[8] + digits[10];
      const total = evenSum * 3 + oddSum;
      const nextTen = Math.ceil(total / 10) * 10;
      return (nextTen - total) % 10;
    };

    if (unit === "piece") {
      do {
        newBarcodeBase = Math.floor(
          100000000000 + Math.random() * 900000000000
        ).toString(); // 12 haneli rastgele
        const checkDigit = calculateCheckDigit(newBarcodeBase);
        newBarcode = newBarcodeBase + checkDigit; // 13 haneli barkod
      } while (existingBarcodes.includes(newBarcode));
    } else if (unit === "kg") {
      const kgProducts = await Products.findAll({
        where: { unit: "kg", barcode: { [Op.like]: "22%" } },
        attributes: ["barcode"],
        order: [["barcode", "DESC"]],
      });

      let nextCode;
      if (kgProducts.length === 0) {
        nextCode = "00001"; // İlk kg ürünü için başlangıç
      } else {
        const lastKgBarcode = kgProducts[0].barcode;
        const lastCode = parseInt(lastKgBarcode.slice(2, 7), 10); // 3-7. haneler
        nextCode = String(lastCode + 1).padStart(5, "0"); // +1 ve 5 haneli sıfır dolgulu
      }

      newBarcodeBase = `22${nextCode}00000`; // 12 haneli: 2 + 5 + 5
      const checkDigit = calculateCheckDigit(newBarcodeBase);
      newBarcode = newBarcodeBase + checkDigit; // 13 haneli tam barkod

      if (existingBarcodes.includes(newBarcode)) {
        return res.status(500).json({
          message: "Benzersiz barkod üretilemedi, tüm kodlar dolu olabilir.",
        });
      }
    }

    res.status(200).json({
      message: "Yeni barkod başarıyla oluşturuldu",
      barcode: newBarcode,
    });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({
      message: "Barkod oluşturma hatası",
      error: error.message,
    });
  }
});

module.exports = router;
