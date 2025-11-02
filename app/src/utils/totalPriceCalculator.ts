import { PriceMath } from './mathWithPrices';

export function totalPriceCalculator(
  prices: { id: number; price: number }[],
  quantities: { [key: number]: number },
): number {
  let total = 0;
  for (let i = 0; i < prices.length; i++) {
    const { id, price } = prices[i];

    total = PriceMath.add(total, PriceMath.multiply(price, quantities[id]));
  }
  return total;
}
