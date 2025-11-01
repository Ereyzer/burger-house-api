import { PriceMath } from '../utils/mathWithPrices';
import { totalPriceCalculator } from '../utils/totalPriceCalculator';

describe('PriceMath', () => {
  test('add should correctly sum two prices', () => {
    expect(PriceMath.add(10.23, 5.55)).toBe(15.78);
  });

  test('minus should correctly subtract prices', () => {
    expect(PriceMath.minus(5.55, 1.1)).toBe(4.45);
  });

  test('multiply should correctly multiply price and quantity', () => {
    expect(PriceMath.multiply(9.99, 3)).toBe(29.97);
  });

  test('divide should correctly divide price', () => {
    expect(PriceMath.divide(10.0, 4)).toBe(2.5);
  });

  test('divide should throw on division by zero', () => {
    expect(() => PriceMath.divide(5, 0)).toThrow('Division by zero');
  });

  test('handles rounding correctly', () => {
    expect(PriceMath.add(0.105, 0.105)).toBe(0.21);
  });
});

describe('totalPriceCalculator', () => {
  test('calculates total price with correct precision', () => {
    const prices = [
      { id: 1, price: 10.25 },
      { id: 2, price: 5.5 },
      { id: 3, price: 3.33 },
    ];
    const quantities = { 1: 2, 2: 1, 3: 3 };

    // 10.25*2 + 5.50*1 + 3.33*3 = 20.50 + 5.50 + 9.99 = 35.99
    expect(totalPriceCalculator(prices, quantities)).toBe(35.99);
  });

  test('returns 0 for empty inputs', () => {
    expect(totalPriceCalculator([], {})).toBe(0);
  });
});
