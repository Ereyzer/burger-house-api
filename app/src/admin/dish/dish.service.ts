import { ConflictException, Injectable } from '@nestjs/common';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto, UpdateDishPriceDto } from './dto/update-dish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
  ) {}

  async create(createDishDto: CreateDishDto) {
    try {
      let dish = this.dishRepository.create(createDishDto);
      dish = await this.dishRepository.save(dish);
      return dish;
    } catch (error) {
      const { code } = error as { code: string } & Error;
      if (code === '23505') {
        throw new ConflictException('dish alredy exist');
      }
    }
  }

  findAll() {
    return this.dishRepository.find();
  }

  // TODO: with relations
  findOne(id: number) {
    return `This action returns a #${id} dish`;
  }

  findMany(ids: number[]): Promise<Dish[]> {
    return this.dishRepository.find({ where: { id: In(ids) } });
  }

  // TODO: relations
  update(id: number, updateDishDto: UpdateDishDto) {
    console.log(updateDishDto);

    return `This action updates a #${id} dish`;
  }

  updatePrice(id: number, { price }: UpdateDishPriceDto) {
    return this.dishRepository.update(id, { price });
  }

  remove(id: number) {
    return this.dishRepository.delete(id);
  }
}
