import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { OrdersService } from '../../modules/orders/orders.service';
import { GetAllOrdersDto } from '../../modules/orders/dto/getAllOrders.dto';
import { UpdateOrderStatusDto } from '../../modules/orders/dto/update-order.dto';
import { AuthWithBearerToken } from '../../decorators/authWithBearerToken.decorator';
import { RequirePermission } from '../../decorators/requiredPermission.decorator';
import { PermissionsEnum } from '../../enum/permissions.enum';

@AuthWithBearerToken()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @RequirePermission(PermissionsEnum.ORDER_READ)
  @Get('by/phone/:phone')
  getByPhone(
    @Param('phone') phone: string,
    @Query() { page, perPage }: GetAllOrdersDto,
  ) {
    return this.ordersService.findByPhone(phone, page, perPage);
  }

  // @RequirePermission(PermissionsEnum.ORDER_READ)
  // @Get('by/street/:street')
  // getByStreet(@Param('street') street: string) {
  //   return this.ordersService.findByStreet(street);
  // }
  @RequirePermission(PermissionsEnum.ORDER_READ)
  @Get('/')
  findAll(@Query() { page, perPage }: GetAllOrdersDto) {
    return this.ordersService.findAll(page, perPage);
  }

  @RequirePermission(PermissionsEnum.ORDER_READ)
  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.ordersService.findOne(id);
  }

  @RequirePermission(PermissionsEnum.ORDER_UPDATE_STAUS)
  @Patch('status/:id')
  updateStatus(
    @Param('id') id: number,
    @Body() { status }: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, status);
  }
}
