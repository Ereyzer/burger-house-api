import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { ClientService } from './client.service';
import { GetAllQueryDto } from './dto/getAllQuery.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { CreateOrderDto } from '../modules/orders/dto/create-order.dto';
import { Post } from '@nestjs/common';
import { CountPriceDto } from './dto/countPrice.dt';
import { GoogleMapsService } from '../modules/google-maps/google-maps.service';

@Controller('client')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly googleMapsService: GoogleMapsService,
  ) {}

  // get all menu item with pagination and sort by (price, popular) and filter by category
  @Get('menu')
  findAll(@Query() { page, perPage, category }: GetAllQueryDto) {
    return this.clientService.findAll(page, perPage, category);
  }

  // open all info about meal
  @Get('menu/:id')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(+id);
  }

  @Get('about')
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            id: {
              type: 'number',
              example: 1,
            },
            facebook: {
              type: 'string',
            },
            instagram: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            phone: {
              type: 'string',
            },
            about_description: {
              type: 'string',
              example: 'Дуже смачно!!!',
            },
          },
        },
      ],
    },
  })
  getAbout() {
    return this.clientService.getAbout();
  }

  @Post('neworder')
  newOrder(@Body() order: CreateOrderDto) {
    return this.clientService.newOrder(order);
  }

  @Post('newOrder/totalPrice')
  totalPrice(@Body() { items, isDelivery, distance }: CountPriceDto) {
    return this.clientService.totalPrice(items, isDelivery, distance);
  }

  @Get('street/autocomplete')
  autocomplete(@Query('q') query: string) {
    return this.googleMapsService.autocomplete(query);
  }

  @ApiOkResponse({
    example: { distanceMeters: 2325, duration: '334s' },
  })
  @Post('distance')
  distance(
    @Body() { street, houseNumber }: { street: string; houseNumber: string },
  ) {
    return this.googleMapsService.getDistanceMatrix(
      `${street.split(' ').join('%20')}%20${houseNumber}`,
    );
  }
}
