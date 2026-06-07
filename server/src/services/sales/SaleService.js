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

const getMonthlyRevenue = (sales) => {
  const buckets = {};
  sales.forEach((sale) => {
    const amount = Math.abs(parseFloat(sale.total_amount) || 0);
    const d      = new Date(sale.createdAt);
    const key    = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label  = d.toLocaleString("en", { month: "short", year: "2-digit" });
    if (!buckets[key]) buckets[key] = { month: label, revenue: 0, orders: 0 };
    if (sale.type === "return") {
      buckets[key].revenue -= amount;
    } else {
      buckets[key].revenue += amount;
      buckets[key].orders  += 1;
    }
  });
  return Object.entries(buckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => ({ ...v, revenue: Math.max(0, parseFloat(v.revenue.toFixed(2))) }));
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
      monthlyRevenue: getMonthlyRevenue(sales),
    };
  } catch (error) {
    throw error;
  }
};

export { CreateSale, GetSalesByUserId };
