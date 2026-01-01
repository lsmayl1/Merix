import { Sale } from "../../models/index.js";
import { AppError } from "../../utils/AppError.js";
import { DateFormat } from "../../utils/DateFormat.js";
import { CalculateSale } from "../report/SaleReport.js";
const CreateSale = async (saleData, userId) => {
  try {
    const {
      id,
      paymentMethod,
      type,
      date,
      total_amount,
      discount,
      discounted_amount,
      subtotal_amount,
      userId,
    } = saleData;
    if (!total_amount || !paymentMethod || !type) {
      throw new AppError("All fields are required", 400);
    }
    const newSale = await Sale.create({
      id,
      total_amount,
      discount,
      discounted_amount,
      subtotal_amount,
      paymentMethod,
      type,
      createdAt: date || new Date(),
      userId,
    });
    return newSale;
  } catch (error) {
    throw error;
  }
};

const GetSalesByUserId = async (useId) => {
  try {
    const sales = await Sale.findAll({ where: { userId: useId } });
    if (!sales) {
      throw new AppError("No sales found for this user", 404);
    }
    const results = CalculateSale(sales);

    return {
      sales: sales.map((sale) => ({
        ...sale.toJSON(),
        date: DateFormat(sale.createdAt),
      })),
      summary: results,
    };
  } catch (error) {
    throw error;
  }
};

export { CreateSale, GetSalesByUserId };
