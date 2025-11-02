import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientMenu } from './entities/clientMenu.entity';
import { OrdersBaseModule } from '../modules/orders/ordersBase.module';
import { MenuModule } from '../admin/menu/menu.module';
import { AboutModule } from '../admin/about/about.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([ClientMenu]),
    OrdersBaseModule,
    MenuModule,
    AboutModule,
  ],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
