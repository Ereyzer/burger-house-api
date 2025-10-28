import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClientMenu } from './entities/clientMenu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { calculatePaginationData } from '../utils/calculatePaginationParams.utils';
import { ClientAboutPlace } from './entities/clientAboutPlace.entity';
import { OrdersService } from '../modules/orders/orders.service';
import { CreateOrderDto } from '../modules/orders/dto/create-order.dto';
import { OrdersGateway } from '../modules/orders/orders.gateway';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientMenu)
    private readonly clientMenu: Repository<ClientMenu>,
    @InjectRepository(ClientAboutPlace)
    private readonly clientAboutPace: Repository<ClientAboutPlace>,
    private readonly orderService: OrdersService,
    private readonly ordersGateway: OrdersGateway,
  ) {}

  async findAll(page: number, take: number, category?: string) {
    const skip = (page - 1) * take;
    const where = {
      onboard: true,
      ...(!category
        ? {}
        : {
            categories: { id: category },
          }),
    };

    const [totalItems, items] = await Promise.all([
      this.clientMenu.count({
        where,
      }),
      this.clientMenu.find({
        where,
        select: {
          id: true,
          title: true,
          subtitle: true,
          price: true,
          image_medium: true,
          categories: false,
        },
        order: {
          title: 'ASC',
          subtitle: 'asc',
        },
        skip,
        take,
      }),
    ]);

    const paginatioData = calculatePaginationData(totalItems, page, take);
    if (paginatioData.totalItems === 0) return { items, ...paginatioData };
    if (paginatioData.page > paginatioData.totalPages)
      throw new BadRequestException(`page ${page} not exist`);

    return { items, ...paginatioData };
  }

  async findOne(id: number) {
    const item = await this.clientMenu.findOne({
      where: { id },
      relations: { categories: true, dishes: true, drinks: true },
    });

    return item;
  }

  getAbout() {
    return this.clientAboutPace.findOneBy({ id: 1 });
  }

  async newOrder(createOrderDto: CreateOrderDto) {
    const order = await this.orderService.create(createOrderDto);
    this.ordersGateway.pushNewOrder(order).catch(() => {});
    return {
      status: order.status,
      id: order.id,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
