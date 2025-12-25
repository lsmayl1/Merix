import { Sale } from "../../models/index.js";
import { AppError } from "../../utils/AppError.js";
import { DateFormat } from "../../utils/DateFormat.js";
const CreateSale = async (saleData, userId) => {
  try {
    const { id, amount, paymentMethod, type, date } = saleData;
    if (!amount || !paymentMethod || !type) {
      throw new AppError("All fields are required", 400);
    }
    const newSale = await Sale.create({
      id,
      amount,
      paymentMethod,
      type,
      createdAt: date || new Date(),
      userId: userId,
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
    let totalRevenue = 0;
    let totalCard = 0;
    let totalCash = 0;

    sales.forEach((sale) => {
      totalRevenue += Number(sale.amount);
      if (sale.paymentMethod === "card") {
        totalCard += sale.amount;
      }
      if (sale.paymentMethod === "cash") {
        totalCash += Number(sale.amount);
      }
    });
    return {
      sales: sales.map((sale) => ({
        ...sale.toJSON(),
        date: DateFormat(sale.createdAt),
      })),
      totalRevenue,
      totalCard,
      totalCash,
    };
  } catch (error) {
    throw error;
  }
};

export { CreateSale, GetSalesByUserId };
