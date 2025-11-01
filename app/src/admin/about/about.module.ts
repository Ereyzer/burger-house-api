import { Module } from '@nestjs/common';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { About } from './entities/about.entity';
import { OpeningHour } from './entities/openingTime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([About, OpeningHour])],
  controllers: [AboutController],
  providers: [AboutService],
  exports: [AboutService],
})
export class AboutModule {}
