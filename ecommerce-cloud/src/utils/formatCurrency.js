/**
 * Format a number as Indian Rupee currency.
 * e.g. 1299 → "₹1,299"
 *      799.50 → "₹800"
 */
export function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return '₹0';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
