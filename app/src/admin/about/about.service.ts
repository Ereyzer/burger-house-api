import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateAboutDto } from './dto/update-about.dto';
import { Repository } from 'typeorm';
import { About } from './entities/about.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OpeningHour } from './entities/openingTime.entity';
import { UpdateOpeningHoursDto } from './dto/updateOpeningHours.dto';
import { DeliveryPrices } from './entities/deliveryPrices.entity';

@Injectable()
export class AboutService {
  constructor(
    @InjectRepository(About)
    private readonly aboutRepository: Repository<About>,
    @InjectRepository(OpeningHour)
    private readonly openingHoursRepository: Repository<OpeningHour>,
    @InjectRepository(DeliveryPrices)
    private readonly deliveryPricesRepository: Repository<DeliveryPrices>,
  ) {}

  async findOne() {
    return {
      ...(await this.aboutRepository.findOne({ where: { id: 1 } })),
      openningHours: await this.getOpeningHours(),
    };
  }

  upsert(updateAboutDto: UpdateAboutDto) {
    return this.aboutRepository.save({ id: 1, ...updateAboutDto });
  }

  async upsertOpeningHours(day: UpdateOpeningHoursDto) {
    try {
      await this.openingHoursRepository.upsert(day, {
        conflictPaths: ['dayOfWeek'],
      });
      return day;
    } catch {
      throw new InternalServerErrorException();
    }
  }
  getOpeningHoursByDay(dayOfWeek: UpdateOpeningHoursDto['dayOfWeek']) {
    return this.openingHoursRepository.findOneBy({ dayOfWeek });
  }
  getOpeningHours() {
    return this.openingHoursRepository.find({ order: { dayOfWeek: 'ASC' } });
  }
  getDeliveryPrices() {
    return this.deliveryPricesRepository.find({
      order: { distance: 'ASC', minOrder: 'ASC' },
    });
  }
}
