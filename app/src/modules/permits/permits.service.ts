import { Injectable } from '@nestjs/common';
import { CreatePermitDto } from './dto/create-permit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permit } from './entities/permit.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermitsService {
  constructor(
    @InjectRepository(Permit)
    private readonly permitsReposytory: Repository<Permit>,
  ) {}
  create(createPermitDto: CreatePermitDto) {
    console.log(createPermitDto);

    return 'This action adds a new permit';
  }

  findAll(): Promise<Permit[]> {
    return this.permitsReposytory.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} permit`;
  }

  remove(id: number) {
    return `This action removes a #${id} permit`;
  }
}
