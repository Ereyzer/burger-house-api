import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { MenuItemInOrder } from './entities/menuItemInOrder.entity';
import { CustomerOrderPhoneEntity } from './entities/customerOrderPhone.entity';
import { CipherAndHashService } from '../../services/CipherAndHash.service';
import { RolesModule } from '../../admin/roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      MenuItemInOrder,
      CustomerOrderPhoneEntity,
      RolesModule,
    ]),
  ],
  controllers: [],
  providers: [OrdersGateway, OrdersService, CipherAndHashService],
  exports: [OrdersService, OrdersGateway],
})
export class OrdersBaseModule {}
