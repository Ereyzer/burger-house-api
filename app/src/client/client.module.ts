import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientMenu } from './entities/clientMenu.entity';
import { ClientAboutPlace } from './entities/clientAboutPlace.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientMenu, ClientAboutPlace])],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
