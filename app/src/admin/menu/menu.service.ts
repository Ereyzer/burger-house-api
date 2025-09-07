import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { AddDrinkInMenuDto, UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { MenuInCategory } from './entities/menu-in-category.entity';
import { DrinkInMenu } from './entities/drink-in-menu.entity';
import { DrinkService } from '../drink/drink.service';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(MenuInCategory)
    private readonly menuInCategoryRepository: Repository<MenuInCategory>,
    @InjectRepository(DrinkInMenu)
    private readonly drinkInMenuRepository: Repository<DrinkInMenu>,
    private readonly categoryService: CategoriesService,
    private readonly drinkService: DrinkService,
  ) {}

  async create({
    categories = [],
    drinks = [],
    ...createMenuDto
  }: CreateMenuDto) {
    try {
      const item = this.menuRepository.create(createMenuDto);
      const categoryEntities = await this.categoryService.findMany(categories);
      item.categories = categoryEntities;
      const drinkItems = await this.drinkService.findMany(drinks);
      item.drinks = drinkItems;
      const menuItem = await this.menuRepository.save(item);
      return menuItem;
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
      relations: { categories: true, drinks: true },
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

  rmCategory(menu_id: number, category_id: string) {
    return this.menuInCategoryRepository.delete({
      menu_id,
      category_id,
    });
  }

  addDrinks(menu_id: number, { drink: drink_id }: AddDrinkInMenuDto) {
    const drink = this.drinkInMenuRepository.create({ menu_id, drink_id });
    return this.drinkInMenuRepository.save(drink);
  }
  rmDrinks(menu_id: number, drink_id: number) {
    return this.drinkInMenuRepository.delete({ menu_id, drink_id });
  }

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
