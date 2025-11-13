import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClientMenu } from './entities/clientMenu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { calculatePaginationData } from '../utils/calculatePaginationParams.utils';
import { OrdersService } from '../modules/orders/orders.service';
import { CreateOrderDto } from '../modules/orders/dto/create-order.dto';
import { CountPriceDto } from './dto/countPrice.dt';
import { MenuService } from '../admin/menu/menu.service';
import { totalPriceCalculator } from '../utils/totalPriceCalculator';
import { AboutService } from '../admin/about/about.service';
import { PriceMath } from '../utils/mathWithPrices';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientMenu)
    private readonly clientMenu: Repository<ClientMenu>,
    private readonly menuService: MenuService,
    private readonly orderService: OrdersService,
    private readonly aboutService: AboutService,
    // private readonly ordersGateway: OrdersGateway,
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

  async getAbout() {
    return {
      ...(await this.aboutService.findOne()),
      openingHours: await this.aboutService.getOpeningHours(),
    };
  }

  async newOrder(createOrderDto: CreateOrderDto) {
    const { total, delivery } = await this.totalPrice(
      [...createOrderDto.selections],
      createOrderDto.delivery,
      createOrderDto.distance,
    );
    createOrderDto.amount = total;
    createOrderDto.deliveryPrice = delivery;
    const order = await this.orderService.create(createOrderDto);

    // order.amount = total;
    // order.deliveryPrice = delivery;
    // this.ordersGateway.pushNewOrder(order).catch(() => {});
    return {
      status: order.status,
      id: order.id,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  async totalPrice(
    items: CountPriceDto['items'],
    isDelivery: CountPriceDto['isDelivery'],
    distance?: CountPriceDto['distance'],
  ) {
    const ids: number[] = [];
    const quantityObj = items.reduce(
      (acc, item) => {
        acc[item.id] = item.quantity;
        ids.push(item.id);
        return acc;
      },
      {} as { [key: number]: number },
    );
    const [menuItems, deliveryPrices] = await Promise.all([
      this.menuService.findByIds(ids, ['price']),
      this.aboutService.getDeliveryPrices(),
    ]);

    const subTotal = totalPriceCalculator(menuItems, quantityObj);
    const discont = 0;
    const deliveryDistance = distance || deliveryPrices[0].distance;
    const outOfDistance = !isDelivery
      ? false
      : !distance ||
        distance > deliveryPrices[deliveryPrices.length - 1].distance;
    let tmpDistance = 0;
    const delivery = !isDelivery
      ? 0
      : deliveryPrices.find((option) => {
          if (
            !(
              (deliveryDistance > tmpDistance &&
                deliveryDistance < option.distance) ||
              option.distance === tmpDistance
            )
          )
            return false;

          if (subTotal < option.minOrder) return true;

          tmpDistance = option.distance;
          return false;
        })?.deliveryPrice || 0;

    const priceWithDelivery = PriceMath.add(subTotal, delivery);
    const total = PriceMath.minus(priceWithDelivery, discont);

    return { total, discont, delivery, subTotal, outOfDistance };
  }
}
