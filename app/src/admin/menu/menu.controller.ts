import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import {
  AddDishInMenuDto,
  AddDrinkInMenuDto,
  UpdateMenuDto,
} from './dto/update-menu.dto';
import { AuthWithBearerToken } from '../../decorators/authWithBearerToken.decorator';
import { RequirePermission } from '../../decorators/requiredPermission.decorator';
import { PermissionsEnum } from '../../enum/permissions.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@AuthWithBearerToken()
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @RequirePermission(PermissionsEnum.MENU_ADD)
  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @RequirePermission(PermissionsEnum.MENU_ONBOARD)
  @Put('onboard/:id')
  switchOnboard(@Param('id') id: string) {
    return this.menuService.switchOnBoard(id);
  }

  @RequirePermission(PermissionsEnum.MENU_UPDATE)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @RequirePermission(PermissionsEnum.MENU_UPDATE)
  @Put('category/:id')
  addCategory(@Param('id') id: string, @Body('name') name: string) {
    return this.menuService.addCategory(id, name);
  }

  @RequirePermission(PermissionsEnum.MENU_UPDATE)
  @Delete('category/:id')
  removeCategory(@Param('id') id: string, @Query('name') name: string) {
    return this.menuService.rmCategory(id, name);
  }

  @RequirePermission(PermissionsEnum.MENU_UPDATE)
  @Put('drinks/:id')
  addDrinks(@Param('id') id: string, @Body() drink: AddDrinkInMenuDto) {
    return this.menuService.addDrink(id, drink);
  }

  @Delete('drinks/:id')
  @RequirePermission(PermissionsEnum.MENU_UPDATE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async rmDrinks(@Param('id') id: string, @Query('drink') drink: string) {
    await this.menuService.rmDrink(id, drink);
    return;
  }

  @Put('dishes/:id')
  @RequirePermission(PermissionsEnum.MENU_UPDATE)
  addDishes(@Param('id') id: string, @Body() dish: AddDishInMenuDto) {
    return this.menuService.addDish(id, dish);
  }

  @Delete('dishes/:id')
  @RequirePermission(PermissionsEnum.MENU_UPDATE)
  async rmDishes(@Param('id') id: string, @Query('dish') dish: string) {
    await this.menuService.rmDish(id, dish);
    return;
  }

  @Patch('images/:id')
  @RequirePermission(PermissionsEnum.MENU_UPDATE)
  @UseInterceptors(FileInterceptor('file'))
  updateImages(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.menuService.updateImages(file, id);
  }

  @RequirePermission(PermissionsEnum.MENU_DELETE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
