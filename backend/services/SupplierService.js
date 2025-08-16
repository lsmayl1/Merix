const {
  Products,
  SupplierTransactionDetails,
  SupplierTransactions,
  ProductStock,
  Suppliers,
  Op,
} = require("../models");
const AppError = require("../utils/AppError");
const formatDate = require("../utils/dateUtils");

const GetSupplierByQuery = async (query) => {
  try {
    if (!query || query.trim().length < 2) {
      throw new AppError("Query must be at least 2 characters long", 400);
    }

    const suppliers = await Suppliers.findAll({
      where: {
        name: {
          [Op.iLike]: `%${query}%`, // Kelimenin herhangi bir yerinde geçmesine izin ver
        },
      },
      include: {
        model: SupplierTransactions,
        as: "transactions",
        attributes: ["amount", "type"],
      },
      order: [["name", "ASC"]],
      limit: 50, // En fazla 20 ürün getir
    });

    if (suppliers.length > 0) {
      const suppliersWithDebt = suppliers.map((supplier) => {
        const transactions = supplier.transactions || [];

        const totalDebt = transactions.reduce((acc, transaction) => {
          const amount = Number(transaction.amount) || 0;

          if (transaction.type === "purchase") {
            return acc + amount;
          } else if (transaction.type === "payment") {
            return acc - amount;
          }
          return acc;
        }, 0);

        // Explicitly exclude transactions from the supplier data
        const { transactions: _, ...supplierData } = supplier.toJSON();

        return {
          ...supplierData,
          totalDebt,
        };
      });
      return suppliersWithDebt;
    } else {
      throw new AppError("No suppliers found for the given query", 404);
    }
  } catch (error) {
    throw error;
  }
};

const CreateTransaction = async (data) => {
  const { supplier_id, products, transaction_date, transaction_type } = data;

  let t; // ← burada tanımlıyoruz
  try {
    // Transaction (veritabanı işlemi) başlatıyoruz
    t = await Products.sequelize.transaction();

    let totalAmount = 0;

    // 1) Ürünleri kontrol et / oluştur / güncelle
    for (const p of products) {
      let product = await Products.findOne({
        where: { barcode: p.barcode },
        transaction: t,
      });

      if (product) {
        // Gerekirse güncelle
        await product.update(
          {
            name: p.name || product.name,
            buyPrice: p.buyPrice || product.buyPrice,
            sellPrice: p.sellPrice || product.sellPrice,
          },
          { transaction: t }
        );
      } else {
        // Yeni ürün oluştur
        product = await Products.create(
          {
            name: p.name,
            barcode: p.barcode,
            buyPrice: p.buyPrice,
            sellPrice: p.sellPrice,
            unit: p.unit,
          },
          { transaction: t }
        );
      }
      // 1.1) Stok güncelleme
      let stockRecord = await ProductStock.findOne({
        where: { product_id: product.product_id },
        transaction: t,
      });
      let stockChange =
        transaction_type === "purchase" ? p.quantity : -p.quantity;

      if (stockRecord) {
        // Güncelle
        await stockRecord.update(
          {
            current_stock: stockRecord.quantity + stockChange,
          },
          { transaction: t }
        );
      } else {
        // Yeni stok kaydı oluştur
        await ProductStock.create(
          {
            product_id: product.product_id,
            current_stock: stockChange > 0 ? stockChange : 0, // negatif başlamasın
          },
          { transaction: t }
        );
      }

      // Toplam fiyatı hesapla
      const lineTotal = p.quantity * p.buyPrice;
      totalAmount += lineTotal;

      // Ürün objesine transaction için ID ekleyelim
      p.product_id = product.product_id;
      p.total_price = lineTotal;
    }

    // 2) SupplierTransaction kaydını oluştur
    const supplierTransaction = await SupplierTransactions.create(
      {
        supplier_id,
        transaction_date: transaction_date || new Date(),
        amount: totalAmount,
        type: transaction_type,
      },
      { transaction: t }
    );

    // 3) SupplierTransactionDetails kayıtlarını oluştur
    const detailsData = products.map((p) => ({
      transaction_id: supplierTransaction.id,
      supplier_id: supplier_id,
      product_id: p.product_id,
      quantity: p.quantity,
      unit_price: p.buyPrice,
      total_price: p.total_price,
    }));

    await SupplierTransactionDetails.bulkCreate(detailsData, {
      transaction: t,
    });

    // Commit işlemi
    await t.commit();

    return { success: true, message: "Transaction created successfully" };
  } catch (error) {
    if (t) await t.rollback();
    throw error;
  }
};

const GetSupplierTransactionsWithDetails = async (id) => {
  try {
    if (!id) {
      throw new AppError("Id not reconized");
    }
    const Transactions = await SupplierTransactions.findAll({
      where: { supplier_id: id },
      include: {
        model: SupplierTransactionDetails,
        as: "details",
        include: {
          model: Products,
          as: "product",
        },
      },
    });

    if (Transactions.length > 0) {
      return Transactions;
    } else {
      throw new AppError("Transactions Not Found", 404);
    }
  } catch (error) {
    throw error;
  }
};

const GetSupplierInvoice = async (supplier_id, transaction_id) => {
  try {
    // Validation
    if (!supplier_id && !transaction_id) {
      throw new AppError("Supplier ID veya Transaction ID gerekli", 404);
    }

    const transaction = await SupplierTransactions.findOne({
      where: { id: transaction_id },
    });
    // Transaction detaylarını getir
    const transactionDetails = await SupplierTransactionDetails.findAll({
      where: { transaction_id },
      attributes: ["quantity", "unit_price", "total_price"],
      include: {
        model: Products,
        as: "product",
        attributes: ["name", "barcode", "unit"],
      },
    });

    const formatedDetails = transactionDetails.map((dt) => ({
      name: dt.product?.name,
      barcode: dt.product?.barcode,
      unit: dt.product?.unit,
      id: dt.id,
      price: dt.unit_price + " ₼",
      quantity: dt.quantity,
      total: dt.total_price + " ₼",
    }));

    if (!transactionDetails.length) {
      throw new AppError("Bu işlem için detay bulunamadı  ", 404);
    }
    const formatedTransaction = {
      ...transaction.toJSON(),
      amount: transaction.amount + " ₼",
      date: formatDate(transaction.createdAt.toJSON()),
    };
    return {
      transaction: formatedTransaction,
      details: formatedDetails, // detayları ekle
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  CreateTransaction,
  GetSupplierTransactionsWithDetails,
  GetSupplierInvoice,
  GetSupplierByQuery,
};
