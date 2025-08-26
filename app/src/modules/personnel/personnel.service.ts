import { Injectable } from '@nestjs/common';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';

@Injectable()
export class PersonnelService {
  create(createPersonnelDto: CreatePersonnelDto) {
    console.log(createPersonnelDto);

    return 'This action adds a new personnel';
  }

  findAll() {
    return `This action returns all personnel`;
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
