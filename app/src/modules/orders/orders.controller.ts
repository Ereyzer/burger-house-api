import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { GetAllOrdersDto } from './dto/getAllOrders.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('by/phone/:phone')
  getByPhone(
    @Param('phone') phone: string,
    @Query() { page, perPage }: GetAllOrdersDto,
  ) {
    return this.ordersService.findByPhone(phone, page, perPage);
  }
  // @Get('by/street/:street')
  // getByStreet(@Param('street') street: string) {
  //   return this.ordersService.findByStreet(street);
  // }

  @Get('all')
  findAll(@Query() { page, perPage }: GetAllOrdersDto) {
    return this.ordersService.findAll(page, perPage);
  }

  @Get('one/:id')
  findOne(@Param('id') id: number) {
    return this.ordersService.findOne(id);
  }

  @Patch('status/:id')
  updateStatus(
    @Param('id') id: number,
    @Body() { status }: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, status);
  }
}
