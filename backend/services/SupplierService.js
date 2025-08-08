const {
  Products,
  SupplierTransactionDetails,
  SupplierTransactions,
} = require("../models");
const AppError = require("../utils/AppError");

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

module.exports = { CreateTransaction, GetSupplierTransactionsWithDetails };
