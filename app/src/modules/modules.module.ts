import { Module } from '@nestjs/common';
import { OrdersBaseModule } from './orders/ordersBase.module';
import { GoogleMapsModule } from './google-maps/google-maps.module';

@Module({
  imports: [OrdersBaseModule, GoogleMapsModule],
})
export class ModulesModule {}
