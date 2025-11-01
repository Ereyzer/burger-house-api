import { Module } from '@nestjs/common';
import { OrdersBaseModule } from './orders/ordersBase.module';

@Module({
  imports: [OrdersBaseModule],
})
export class ModulesModule {}
