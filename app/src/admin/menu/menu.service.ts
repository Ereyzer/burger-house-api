import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { MenuInCategory } from './entities/menu-in-category.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(MenuInCategory)
    private readonly menuInCategoryRepository: Repository<MenuInCategory>,
    private readonly categoryService: CategoriesService,
  ) {}

  async create({ categories = [], ...createMenuDto }: CreateMenuDto) {
    try {
      const item = this.menuRepository.create(createMenuDto);
      const categoryEntities = await this.categoryService.findMany(categories);
      item.categories = categoryEntities;
      return await this.menuRepository.save(item);
    } catch (error) {
      const { code, message } = error as { code: string } & Error;
      if (code === '23505') {
        throw new ConflictException(message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  findAll() {
    return this.menuRepository.find({
      select: {
        id: true,
        title: true,
        subtitle: true,
        onboard: true,
        price: true,
      },
    });
  }

  findOne(id: number) {
    return this.menuRepository.findOne({
      where: { id },
      relations: { categories: true },
    });
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const item = await this.menuRepository.findOneBy({ id });
    if (!item) throw new BadRequestException('Thist item not exist');

    return this.menuRepository.save({ ...item, ...updateMenuDto });
  }

  addCategory(menuId: number, categoryId: string) {
    const relation = this.menuInCategoryRepository.create({
      menu_id: menuId,
      category_id: categoryId,
    });
    return this.menuInCategoryRepository.save(relation);
  }
  rmCategory(menuId: number, categoryId: string) {
    return this.menuInCategoryRepository.delete({
      menu_id: menuId,
      category_id: categoryId,
    });
  }

  addDrinks() {}
  rmDrinks() {}

  addDishes() {}
  rmDishes() {}

  updateImages() {}

  async switchOnBoard(id: number) {
    const currentStatus = await this.menuRepository.findOne({
      select: { onboard: true },
      where: { id },
    });
    if (!currentStatus) throw new BadRequestException('Item do not exist');
    return this.menuRepository.update(id, { onboard: !currentStatus.onboard });
  }

  remove(id: number) {
    return this.menuRepository.delete(id);
  }
}
