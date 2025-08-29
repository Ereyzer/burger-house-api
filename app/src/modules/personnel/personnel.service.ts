import { Injectable } from '@nestjs/common';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Personnel } from './entities/personnel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PersonnelService {
  constructor(
    @InjectRepository(Personnel)
    private readonly persnnelRepository: Repository<Personnel>,
  ) {}

  create(createPersonnelDto: CreatePersonnelDto) {
    console.log(createPersonnelDto);

    return 'This action adds a new personnel';
  }

  findAll() {
    return this.persnnelRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} personnel is`;
  }

  update(id: number, updatePersonnelDto: UpdatePersonnelDto) {
    console.log(updatePersonnelDto);

    return `This action updates a #${id} personnel`;
  }

  remove(id: number) {
    return `This action removes a #${id} personnel`;
  }
}
