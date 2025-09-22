import { Sale } from "../../models/index.js";
import { AppError } from "../../utils/AppError.js";

const CreateSale = async (saleData) => {
  try {
    const { id, amount, paymentMethod, type } = saleData;
    if (!amount || !paymentMethod || !type) {
      throw new AppError("All fields are required", 400);
    }
    const newSale = await Sale.create({
      id,
      amount,
      paymentMethod,
      type,
    });
    return newSale;
  } catch (error) {
    throw error;
  }
};

export { CreateSale };
