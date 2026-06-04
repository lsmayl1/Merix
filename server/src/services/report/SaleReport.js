// Normalize payment method values from both ERP and Admin
const normPm = (pm) => {
  if (!pm) return null;
  if (pm === "card" || pm === "credit_card") return "card";
  if (pm === "cash") return "cash";
  return pm;
};

const CalculateSale = (sales) => {
  let totalSales = 0;
  let totalDiscounts = 0;
  let totalRevenue = 0;
  let totalCash = 0;
  let totalCard = 0;
  let returnSales = 0;

  sales.forEach((sale) => {
    const type          = sale.type;
    const paymentMethod = normPm(sale.paymentMethod);
    // Ensure amount is always a positive number for arithmetic
    const totalAmount      = Math.abs(parseFloat(sale.total_amount)      || 0);
    const discountedAmount = Math.abs(parseFloat(sale.discounted_amount) || 0);

    if (type === "sale" || type === null) {
      // null type treated as sale (legacy rows before mapping was fixed)
      totalSales    += 1;
      totalDiscounts += discountedAmount;
      totalRevenue   += totalAmount;
      if (paymentMethod === "cash")  totalCash += totalAmount;
      else if (paymentMethod === "card") totalCard += totalAmount;
    } else if (type === "return") {
      returnSales    += 1;
      totalDiscounts -= discountedAmount;
      totalRevenue   -= totalAmount;
      if (paymentMethod === "cash")  totalCash -= totalAmount;
      else if (paymentMethod === "card") totalCard -= totalAmount;
    }
  });

  return {
    totalSales,
    totalDiscounts,
    totalRevenue,
    totalCash,
    totalCard,
    returnSales,
  };
};

export { CalculateSale };
