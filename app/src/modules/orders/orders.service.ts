import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Not, Repository } from 'typeorm';
import { MenuItemInOrder } from './entities/menuItemInOrder.entity';
import { CustomerOrderPhoneEntity } from './entities/customerOrderPhone.entity';
import { CipherAndHashService } from '../../services/CipherAndHash.service';
import { calculatePaginationData } from '../../utils/calculatePaginationParams.utils';
import { BadRequestException } from '@nestjs/common';
import { OrderStatus } from './types/enums';
import { InternalServerErrorException } from '@nestjs/common';
import { envVarValue } from '../../config/constants/env-constants';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(MenuItemInOrder)
    private readonly menuItemRepository: Repository<MenuItemInOrder>,
    @InjectRepository(CustomerOrderPhoneEntity)
    private readonly customerPhoneHashRepository: Repository<CustomerOrderPhoneEntity>,
    private readonly dataSource: DataSource,
    private readonly cipher: CipherAndHashService,
  ) {}
  async create({ selections, phone, ...createOrderDto }: CreateOrderDto) {
    const queryRanner = this.dataSource.createQueryRunner();
    await queryRanner.connect();
    await queryRanner.startTransaction();

    try {
      const [item, hashPhoneAll] = await Promise.all([
        queryRanner.manager.save(
          queryRanner.manager.create(Order, { ...createOrderDto, phone }),
        ),
        this.cipher.createHash(phone, envVarValue.PHONE_SALT),
      ]);

      const subItems = selections.map(({ id, quantity }) =>
        queryRanner.manager.create(MenuItemInOrder, {
          order_id: item.id,
          menu_id: id,
          quantity,
        }),
      );
      const [sel] = await Promise.all([
        queryRanner.manager.save(subItems),
        queryRanner.manager
          .createQueryBuilder()
          .insert()
          .into(CustomerOrderPhoneEntity)
          .values({
            hashPhone: hashPhoneAll.slice(0, 29),
            orderId: item.id,
          })
          .execute(),
      ]);
      item.selections = sel;
      await queryRanner.commitTransaction();
      return item;
    } catch (e) {
      console.log(e);

      await queryRanner.rollbackTransaction();
      // TODO: informative exeptionthrow
      throw new InternalServerErrorException(
        'Помилка при створенні замовлення. Спробуйте пізніше.',
      );
    } finally {
      await queryRanner.release();
    }
  }

  // TODO: maby less info in futere
  async findByPhone(
    phone: string,
    page: number,
    take: number,
    order: 'DESC' | 'ASC' = 'DESC',
  ) {
    const skip = (page - 1) * take;
    const hashPhone = (
      await this.cipher.createHash(phone, envVarValue.PHONE_SALT)
    ).slice(0, 29);

    const [totalItems, items] = await Promise.all([
      this.customerPhoneHashRepository
        .createQueryBuilder('cph')
        .where('cph.hash_phone = :hashPhone', { hashPhone })
        .getCount(),
      this.customerPhoneHashRepository
        .createQueryBuilder('cph')
        .innerJoin('cph.order', 'o', 'cph.order_id = o.id')
        .where('cph.hash_phone = :hashPhone', { hashPhone })
        .select([
          'o.id AS id',
          'o.createdAt AS createdAt',
          'o.payment AS payment',
          'o.amount AS amount',
          'o.phone AS phone',
          'o.customerName AS customerName',
          'o.delivery AS delivery',
          'o.street AS street',
          // 'o.status AS status',
          // 'o.addressFull AS addressFull',
          // 'o.addressClarification AS addressClarification',
          // 'o.description AS description',
          // 'o.email AS email',
        ])
        .skip(skip)
        .take(take)
        .orderBy('o.createdAt', order)
        .getRawMany(),
    ]);
    const paginatioData = calculatePaginationData(totalItems, page, take);
    if (paginatioData.totalItems === 0) return { items: [], ...paginatioData };
    if (paginatioData.page > paginatioData.totalPages)
      throw new BadRequestException(`page ${page} not exist`);

    return { items, ...paginatioData };
  }

  async findAll(page: number, take: number, order: 'DESC' | 'ASC' = 'DESC') {
    const skip = (page - 1) * take;

    const [totalItems, items] = await Promise.all([
      this.orderRepository.count(),
      this.orderRepository.find({ skip, take, order: { createdAt: order } }),
    ]);

    const paginatioData = calculatePaginationData(totalItems, page, take);
    if (paginatioData.totalItems === 0) return { items, ...paginatioData };
    if (paginatioData.page > paginatioData.totalPages)
      throw new BadRequestException(`page ${page} not exist`);

    return { items, ...paginatioData };
  }

  async findActual() {
    const items = await this.orderRepository.find({
      where: { status: Not(OrderStatus.DELIVERED) },
      order: { createdAt: 'DESC' },
    });

    return items;
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        selections: {
          selection: {
            drinks: true,
            dishes: true,
            categories: true,
          },
        },
      },
    });
    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    const { affected } = await this.orderRepository.update({ id }, { status });
    if (!affected)
      throw new InternalServerErrorException('status did not updated');

    return { id, status };
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    console.log(updateOrderDto);

    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
