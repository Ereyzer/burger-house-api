import { Injectable } from '@nestjs/common';
import { UpdateAboutDto } from './dto/update-about.dto';
import { Repository } from 'typeorm';
import { About } from './entities/about.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AboutService {
  constructor(
    @InjectRepository(About)
    private readonly aboutRepository: Repository<About>,
  ) {}

  findOne() {
    return this.aboutRepository.findOneBy({ id: 1 });
  }

  upsert(updateAboutDto: UpdateAboutDto) {
    return this.aboutRepository.save({ id: 1, ...updateAboutDto });
  }
}
