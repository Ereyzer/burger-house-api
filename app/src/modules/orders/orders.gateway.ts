import {
  SubscribeMessage,
  // MessageBody,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { OrdersService } from './orders.service';
// import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';
import { Server } from 'socket.io';
import { Order } from './entities/order.entity';
import {
  forwardRef,
  Inject,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { defaultConstants } from '../../config/constants/default-constants';
import { WsJwtGuard } from '../../helpers/websoket.token.guard';
import { TokenJob } from '../../helpers/tokenJob';
import { AuthenticatedSocket } from './interfaces/authSocket.interface';
import { RolesService } from '../../admin/roles/roles.service';
import { PermissionsEnum } from '../../enum/permissions.enum';

@WebSocketGateway({
  namespace: 'orders',
  cors: {
    origin: [defaultConstants.domains.ADMIN],
    credentials: true,
  },
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly tokenJob: TokenJob = TokenJob.instance;
  constructor(
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
    private readonly roleService: RolesService,
  ) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(client: AuthenticatedSocket) {
    const [type, token] =
      client.handshake.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      client.emit('error', new UnauthorizedException('Invalid token format'));
      return client.disconnect(true);
    }
    try {
      const payload = this.tokenJob.check(token);
      const permits =
        ((await this.roleService.findOne(payload.role))
          ?.permits as PermissionsEnum[]) || [];

      client['user'] = {
        ...payload,
        permits,
      };

      // TODO: expired token
      const expiresInMs = Number(client.user.exp) * 1000 - Date.now();

      setTimeout(() => {
        client.emit(
          'error',
          new UnauthorizedException('Session expired, please refresh token.'),
        );
        client.disconnect(true);
      }, expiresInMs);
    } catch (error) {
      const er = error as Error;
      client.emit('error', new UnauthorizedException(er.message));

      return client.disconnect(true);
    }
  }

  handleDisconnect() {
    console.log('socket dsconnect');
  }

  async pushNewOrder(order: Order) {
    const allClients =
      (await this.server.fetchSockets()) as unknown as AuthenticatedSocket[];

    allClients.forEach((client) => {
      const isAuthorized =
        client.user && client.user.permits.includes(PermissionsEnum.ABOUT_GET);
      if (!isAuthorized) return;
      client.emit('newOrderCreated', order);
    });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('newOrderCreated')
  newUserMesage() {
    console.log('new user');
  }
}

// TODO: next step push actual info about order to client
// @WebSocketGateway({
//   namespace: 'client/order',
//   cors: {
//     origin: [defaultConstants.domains.CLIENT],
//     credentials: false,
//   },
// })
// export class ClientOrderWsGateway implements OnGatewayConnection {
//   constructor() {}
//   @WebSocketServer()
//   server: Server;

//   handleConnection(
//     _client: Socket,
//     //  ...args: any[]
//   ) {}
// }
// @SubscribeMessage('createOrder')
// create(@MessageBody() createOrderDto: CreateOrderDto) {
//   return this.ordersService.create(createOrderDto);
// }

// @SubscribeMessage('findAllOrders')
// findAll() {
//   return this.ordersService.findAll();
// }
// @SubscribeMessage('findOneOrder')
// async findOne(@MessageBody() id: number) {
//   console.log('here');

//   return this.server.emit(
//     'findedNewOneOrder',
//     await this.ordersService.findOne(id),
//   );
// }

// @SubscribeMessage('updateOrder')
// update(@MessageBody() updateOrderDto: UpdateOrderDto) {
//   return this.ordersService.update(updateOrderDto.id, updateOrderDto);
// }

// @SubscribeMessage('removeOrder')
// remove(@MessageBody() id: number) {
//   return this.ordersService.remove(id);
// }
