export class PriceMath {
  // TODO: precision
  private static precision = 10000;
  private static toCents(value: number): number {
    return Number.parseInt((value * this.precision).toFixed(0));
  }

  private static toCurrency(value: number): number {
    return value === 0
      ? 0
      : Number.parseFloat((value / this.precision).toFixed(2));
  }
  public static add(a: number, b: number): number {
    return this.toCurrency(this.toCents(a) + this.toCents(b));
  }
  public static minus(a: number, b: number): number {
    return this.toCurrency(this.toCents(a) - this.toCents(b));
  }
  public static multiply(a: number, b: number): number {
    return this.toCurrency(
      (this.toCents(a) * this.toCents(b)) / this.precision,
    );
  }
  public static divide(a: number, b: number): number {
    if (b === 0) throw new Error('Division by zero');
    return this.toCurrency(
      (this.toCents(a) / this.toCents(b)) * this.precision,
    );
  }
}

export class TestMath {
  currentNum: number;
  constructor(n: number) {
    this.currentNum = n;
  }

  add(n: TestMath) {
    return new TestMath(this.currentNum + n.currentNum);
  }
  answer() {
    return this.currentNum;
  }
}
