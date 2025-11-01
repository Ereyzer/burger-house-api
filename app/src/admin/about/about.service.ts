import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateAboutDto } from './dto/update-about.dto';
import { Repository } from 'typeorm';
import { About } from './entities/about.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OpeningHour } from './entities/openingTime.entity';
import { UpdateOpeningHoursDto } from './dto/updateOpeningHours.dto';

@Injectable()
export class AboutService {
  constructor(
    @InjectRepository(About)
    private readonly aboutRepository: Repository<About>,
    @InjectRepository(OpeningHour)
    private readonly openingHoursRepository: Repository<OpeningHour>,
  ) {}

  findOne() {
    return this.aboutRepository.findOneBy({ id: 1 });
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
}
