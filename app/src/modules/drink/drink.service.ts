import { Injectable } from '@nestjs/common';
import { CreateDrinkDto } from './dto/create-drink.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Drink } from './entities/drink.entity';
import { FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { UpdateDrinkPriceDto } from './dto/update-drink.dto';

@Injectable()
export class DrinkService {
  constructor(
    @InjectRepository(Drink)
    private readonly drinkRepository: Repository<Drink>,
  ) {}

  create(createDrinkDto: CreateDrinkDto) {
    const drink = this.drinkRepository.create(createDrinkDto);
    return this.drinkRepository.save(drink);
  }

  findAll() {
    return this.drinkRepository.find();
  }

  findOne(id: number, options: FindOneOptions<Drink> = {}) {
    return this.drinkRepository.findOne({ where: { id }, ...options });
  }

  updatePrice(
    id: number,
    { price }: UpdateDrinkPriceDto,
  ): Promise<UpdateResult> {
    return this.drinkRepository.update(id, { price });
  }

  remove(id: number) {
    return this.drinkRepository.delete(id);
  }
}
