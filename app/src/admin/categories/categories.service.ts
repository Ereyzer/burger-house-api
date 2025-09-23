import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categiryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    const category = this.categiryRepository.create(createCategoryDto);
    return this.categiryRepository.save(category);
  }

  findAll() {
    return this.categiryRepository.find({
      select: { id: true, display_name: true },
    });
  }

  findOne(id: string) {
    return this.categiryRepository.findOneBy({ id });
  }

  findMany(ids: string[]) {
    return this.categiryRepository.find({ where: { id: In(ids) } });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    if (!category) {
      throw new BadRequestException('wrong id');
    }
    return this.categiryRepository.save({ ...category, ...updateCategoryDto });
  }

  remove(id: string) {
    return this.categiryRepository.delete(id);
  }
}
