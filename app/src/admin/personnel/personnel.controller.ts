import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PersonnelService } from './personnel.service';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import {
  UpdatePersonnelDto,
  UpdatePersonnelEmailDto,
  UpdatePersonnelRoleDto,
} from './dto/update-personnel.dto';
import { AuthWithBearerToken } from '../../decorators/authWithBearerToken.decorator';
import { RequirePermission } from '../../decorators/requiredPermission.decorator';
import { PermissionsEnum } from '../../enum/permissions.enum';
import { UpdatePersonalInfoGuard } from '../../helpers/updatePersonalInfo.guard';

@AuthWithBearerToken()
@Controller('personnel')
export class PersonnelController {
  constructor(private readonly personnelService: PersonnelService) {}

  @RequirePermission(PermissionsEnum.PERSONNEL_ADD)
  @Post()
  async create(@Body() createPersonnelDto: CreatePersonnelDto) {
    await this.personnelService.create(createPersonnelDto);
    return { message: `please check email: ${createPersonnelDto.email}` };
  }

  @RequirePermission(PermissionsEnum.PERSONNEL_GET_ALL)
  @Get()
  findAll() {
    return this.personnelService.findAll();
  }

  @RequirePermission(PermissionsEnum.PERSONNEL_INFO)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personnelService.findOne(id);
  }

  @UseGuards(UpdatePersonalInfoGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePersonnelDto: UpdatePersonnelDto,
  ) {
    return this.personnelService.update(id, updatePersonnelDto);
  }

  @RequirePermission(PermissionsEnum.PERSONNEL_ROLE)
  @Put('role/:id')
  updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdatePersonnelRoleDto,
  ) {
    return this.personnelService.updateRole(id, updateRoleDto);
  }

  // TODO: update pictere
  @UseGuards(UpdatePersonalInfoGuard)
  @Put('picture/:id')
  updatePicture() {}

  @UseGuards(UpdatePersonalInfoGuard)
  @Put('email/:id')
  updateEmail(@Body() updateEmailDto: UpdatePersonnelEmailDto) {
    return this.personnelService.updateEmail(updateEmailDto);
  }

  // TODO: update password
  @UseGuards(UpdatePersonalInfoGuard)
  @Put('password/:id')
  updatePassword() {}

  @RequirePermission(PermissionsEnum.PERSONNEL_DELETE)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.personnelService.remove(id);
  }
}
