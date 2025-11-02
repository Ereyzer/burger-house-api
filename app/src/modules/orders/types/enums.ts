export enum PaymentMethod {
  CARD_ONLINE = 'CARD_ONLINE',
  CARD_ON_DELIVERY = 'CARD_ON_DELIVERY',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  BANK_TRANSFER = 'BANK_TRANSFER',
  PAYPAL = 'PAYPAL',
  APPLE_PAY = 'APPLE_PAY',
  GIFT_CARD = 'GIFT_CARD',
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}
