import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import {
  AddDishInMenuDto,
  AddDrinkInMenuDto,
  UpdateMenuDto,
} from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { FindOptionsSelect, In, Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { MenuInCategory } from './entities/menu-in-category.entity';
import { DrinkInMenu } from './entities/drink-in-menu.entity';
import { DrinkService } from '../drink/drink.service';
import { DishService } from '../dish/dish.service';
import { DishInMenu } from './entities/dish-in-menu.entity';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(MenuInCategory)
    private readonly menuInCategoryRepository: Repository<MenuInCategory>,
    @InjectRepository(DrinkInMenu)
    private readonly drinkInMenuRepository: Repository<DrinkInMenu>,
    @InjectRepository(DishInMenu)
    private readonly dishInMenuRepository: Repository<DishInMenu>,
    private readonly categoryService: CategoriesService,
    private readonly drinkService: DrinkService,
    private readonly dishService: DishService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create({
    categories = [],
    drinks = [],
    dishes = [],
    ...createMenuDto
  }: CreateMenuDto) {
    try {
      const item = this.menuRepository.create(createMenuDto);
      const categoryEntities = await this.categoryService.findMany(categories);
      item.categories = categoryEntities;
      const [drinkItems, dishItems] = await Promise.all([
        this.drinkService.findMany(drinks),
        this.dishService.findMany(dishes),
      ]);

      item.dishes = dishItems;
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
      order: {
        title: 'ASC',
        subtitle: 'ASC',
      },
    });
  }

  findOne(id: number) {
    return this.menuRepository.findOne({
      where: { id },
      relations: { categories: true, drinks: true, dishes: true },
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

  addDrink(menu_id: number, { drink: drink_id }: AddDrinkInMenuDto) {
    const drink = this.drinkInMenuRepository.create({ menu_id, drink_id });
    return this.drinkInMenuRepository.save(drink);
  }
  rmDrink(menu_id: number, drink_id: number) {
    return this.drinkInMenuRepository.delete({ menu_id, drink_id });
  }

  addDish(menu_id: number, { dish: dish_id }: AddDishInMenuDto) {
    const dish = this.dishInMenuRepository.create({ menu_id, dish_id });
    return this.dishInMenuRepository.save(dish);
  }
  rmDish(menu_id: number, dish_id: number) {
    return this.dishInMenuRepository.delete({ menu_id, dish_id });
  }

  async updateImages(file: Express.Multer.File, id: number) {
    const menuItem = await this.findOne(id);
    if (!menuItem) throw new BadRequestException('wrong item id');

    if (!menuItem?.image_medium) {
      try {
        const image = await this.cloudinaryService.uploadFile(file);
        const response = await this.menuRepository.update(id, {
          image_medium: image.url,
        });
        if (response.affected) {
          menuItem.image_medium = image.url;
          return menuItem;
        }
      } catch (error) {
        throw new InternalServerErrorException((error as Error).message);
      }
    } else {
      try {
        const arr = menuItem.image_medium.split('/');
        const name = arr[arr.length - 1];

        const image = await this.cloudinaryService.uploadFile(file, name);
        const response = await this.menuRepository.update(id, {
          image_medium: image.url,
        });

        if (response.affected) {
          menuItem.image_medium = image.url;
          return menuItem;
        }
      } catch (error) {
        throw new InternalServerErrorException((error as Error).message);
      }
    }

    return;
  }

  async switchOnBoard(id: number) {
    const currentStatus = await this.menuRepository.findOne({
      select: { onboard: true },
      where: { id },
    });
    if (!currentStatus) throw new BadRequestException('Item do not exist');
    return this.menuRepository.update(id, { onboard: !currentStatus.onboard });
  }

  async remove(id: number) {
    const menuItem = await this.findOne(id);
    if (menuItem?.image_medium) {
      const arr = menuItem.image_medium.split('/');
      const name = arr[arr.length - 1].split('.')[0];

      this.cloudinaryService.removeFile(name).catch((err) => {
        throw err;
      });
    }
    return this.menuRepository.delete(id);
  }

  async findByIds<K extends keyof Menu>(
    ids: number[],
    selectList: K[] = [] as K[],
  ): Promise<(Pick<Menu, K> & { id: number })[]> {
    const select = ['id', ...selectList].reduce((acc, key) => {
      (acc as { [key]: boolean })[key] = true;
      return acc;
    }, {} as FindOptionsSelect<Menu>);
    return this.menuRepository.find({
      where: { id: In(ids) },
      select,
    });
  }
}
