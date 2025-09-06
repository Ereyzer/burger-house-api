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
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { AuthWithBearerToken } from '../../decorators/authWithBearerToken.decorator';
import { RequirePermission } from '../../decorators/requiredPermission.decorator';
import { PermissionsEnum } from '../../enum/permissions.enum';

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
    return this.menuService.findOne(+id);
  }

  @RequirePermission(PermissionsEnum.MENU_ONBOARD)
  @Put('onboard/:id')
  switchOnboard(@Param('id') id: string) {
    return this.menuService.switchOnBoard(+id);
  }

  @RequirePermission(PermissionsEnum.MENU_UPDATE)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @RequirePermission(PermissionsEnum.MENU_UPDATE)
  @Post('category/:id')
  addCategory(@Param('id') id: number, @Body('name') name: string) {
    return this.menuService.addCategory(id, name);
  }

  @RequirePermission(PermissionsEnum.MENU_UPDATE)
  @Delete('category/:id')
  removeCategory(@Param('id') id: number, @Query('name') name: string) {
    return this.menuService.rmCategory(id, name);
  }

  @RequirePermission(PermissionsEnum.MENU_UPDATE)
  @Post('drinks/:id')
  addDrinks() {}

  @Post('drinks/:id')
  @RequirePermission(PermissionsEnum.MENU_UPDATE)
  rmDrinks() {}

  @Post('dishes/:id')
  @RequirePermission(PermissionsEnum.MENU_UPDATE)
  addDishes() {}

  @Post('dishes/:id')
  @RequirePermission(PermissionsEnum.MENU_UPDATE)
  rmDishes() {}

  @Post('images/:id')
  @RequirePermission(PermissionsEnum.MENU_UPDATE)
  updateImages() {}

  @RequirePermission(PermissionsEnum.MENU_DELETE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
