const conversionRates = {
  kgram: 1,
  gram: 0.001,
  piece: 1,
  peace: 1,
  unit: 1,
};

export function calculateUnit(unit) {
  if (!unit) return 1;
  const lowerUnit = unit.toLowerCase();
  if (!(lowerUnit in conversionRates)) {
    throw new Error(`Invalid unit: ${unit}`);
  }
  return conversionRates[lowerUnit];
}

export function calculateTotalPrice(quantity, unit, pricePerUnit) {
  const conversionRate = calculateUnit(unit);
  const quantityInBaseUnit = quantity * conversionRate;
  return quantityInBaseUnit * pricePerUnit;
}

export function calculateProfit(cost, revenue) {
  return revenue - cost;
}

export function calculateProfitMargin(cost, revenue) {
  if (revenue === 0) return 0;
  return ((revenue - cost) / revenue) * 100;
}

export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + (item.total || item.price || 0), 0);
}

export default {
  calculateUnit,
  calculateTotalPrice,
  calculateProfit,
  calculateProfitMargin,
  calculateTotal,
};
