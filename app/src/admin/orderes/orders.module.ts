import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersBaseModule } from '../../modules/orders/ordersBase.module';

@Module({
  imports: [OrdersBaseModule],
  controllers: [OrdersController],
  providers: [],
  exports: [],
})
export class OrdersModule {}
