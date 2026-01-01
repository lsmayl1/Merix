const CalculateSale = (sales) => {
  let totalSales = 0;
  let totalDiscounts = 0;
  let totalRevenue = 0;
  let totalCash = 0;
  let totalCard = 0;
  let returnSales = 0;

  sales.forEach((sale) => {
    const type = sale.type;
    const paymentMethod = sale.paymentMethod;
    const totalAmount = parseFloat(sale.total_amount) || 0;
    const discountedAmount = parseFloat(sale.discounted_amount) || 0;
    if (type === "sale") {
      totalSales += 1;
      totalDiscounts += discountedAmount;
      totalRevenue += totalAmount;
      if (paymentMethod === "cash") {
        totalCash += totalAmount;
      } else if (paymentMethod === "card") {
        totalCard += totalAmount;
      }
    } else if (type === "return") {
      returnSales += 1;
      totalDiscounts -= discountedAmount;
      totalRevenue -= totalAmount;
      if (type === "cash") {
        totalCash -= totalAmount;
      } else if (type === "card") {
        totalCard -= totalAmount;
      }
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
