/**
 * Centralised billing math.
 *
 * Cart and checkout must both use these helpers rather than
 * recalculating totals inside components. Tax, shipping, and
 * discount are added here when checkout is implemented.
 */

/**
 * Sum of price × quantity across cart lines.
 * Each line needs a numeric `price` and `quantity`.
 */
export function calculateSubtotal(lines) {
  return (lines || []).reduce(
    (sum, line) => sum + Number(line.price || 0) * Number(line.quantity || 0),
    0
  );
}
