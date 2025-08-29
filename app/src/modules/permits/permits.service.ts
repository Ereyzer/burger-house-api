import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permit } from './entities/permit.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class PermitsService {
  constructor(
    @InjectRepository(Permit)
    private readonly permitsReposytory: Repository<Permit>,
  ) {}

  findAll(): Promise<Permit[]> {
    return this.permitsReposytory.find();
  }

  findOne(id: string) {
    return this.permitsReposytory.findOneBy({ id });
  }

  findMany(ids: string[]) {
    return this.permitsReposytory.findBy({ id: In(ids) });
  }
}
