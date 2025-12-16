import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateAboutDto } from './dto/update-about.dto';
import { FindOptionsWhere, LessThan, Repository } from 'typeorm';
import { About } from './entities/about.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OpeningHour } from './entities/openingTime.entity';
import { UpdateOpeningHoursDto } from './dto/updateOpeningHours.dto';
import { DeliveryPrices } from './entities/deliveryPrices.entity';
import { BrakeTimesByDate } from './entities/brakeTimesByDate.entity';
import { CreateBrakeTimeDto } from './dto/create-brakeTime.dto';
import { CreateDeliveryPriceDto } from './dto/create-delivery-price.dto';

@Injectable()
export class AboutService {
  constructor(
    @InjectRepository(About)
    private readonly aboutRepository: Repository<About>,
    @InjectRepository(OpeningHour)
    private readonly openingHoursRepository: Repository<OpeningHour>,
    @InjectRepository(DeliveryPrices)
    private readonly deliveryPricesRepository: Repository<DeliveryPrices>,
    @InjectRepository(BrakeTimesByDate)
    private readonly brakeTimesByDateRepository: Repository<BrakeTimesByDate>,
  ) {}

  async findOne() {
    return this.aboutRepository.findOne({ where: { id: 1 } });
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

  getBrakeTimes(workDate?: string) {
    const where: FindOptionsWhere<BrakeTimesByDate> = {};
    if (workDate) where.workDate = workDate;

    return this.brakeTimesByDateRepository.find({
      where,
      order: { workDate: 'DESC', closesAt: 'DESC' },
    });
  }

  rmBrakeTimeBy(option?: { id: string }) {
    if (!option) {
      const dateNow = new Date();
      const year = dateNow.getFullYear();
      const month = String(dateNow.getMonth()).padStart(2, '0');
      const day = String(dateNow.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      return this.brakeTimesByDateRepository.delete({
        workDate: LessThan(formattedDate),
      });
    } else {
      return this.brakeTimesByDateRepository.delete({
        id: option.id,
      });
    }
  }

  addBrakeTime(brakeTimeDto: CreateBrakeTimeDto) {
    const newBrakeTime = this.brakeTimesByDateRepository.create(brakeTimeDto);
    return this.brakeTimesByDateRepository.save(newBrakeTime);
  }

  getDeliveryPrices() {
    return this.deliveryPricesRepository.find({
      order: { distance: 'ASC', minOrder: 'ASC' },
    });
  }

  addDeliveryPrice(newPrice: CreateDeliveryPriceDto) {
    const tmp = this.deliveryPricesRepository.create(newPrice);

    return this.deliveryPricesRepository.save(tmp);
  }

  async rmDeliveryPrice(id: string) {
    const response = await this.deliveryPricesRepository.delete({ id });
    if (response.affected) return;
    throw new InternalServerErrorException();
  }
}
