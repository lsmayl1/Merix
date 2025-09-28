import { Sale } from "../../models/index.js";
import { AppError } from "../../utils/AppError.js";

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

export { CreateSale };
