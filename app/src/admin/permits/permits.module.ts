import { Module } from '@nestjs/common';
import { PermitsService } from './permits.service';
import { PermitsController } from './permits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permit } from './entities/permit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permit])],
  controllers: [PermitsController],
  providers: [PermitsService],
  exports: [PermitsService],
})
export class PermitsModule {}
