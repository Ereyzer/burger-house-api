import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientMenu } from './entities/clientMenu.entity';
import { ClientAboutPlace } from './entities/clientAboutPlace.entity';
import { OrdersModule } from '../modules/orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientMenu, ClientAboutPlace]),
    OrdersModule,
  ],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
