import { Module } from '@nestjs/common';
import { DrinkService } from './drink.service';
import { DrinkController } from './drink.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drink } from './entities/drink.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Drink])],
  controllers: [DrinkController],
  providers: [DrinkService],
  exports: [DrinkService],
})
export class DrinkModule {}
