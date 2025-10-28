import { Injectable } from '@nestjs/common';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Order } from '../entities/order.entity';
import { CipherAndHashService } from '../../../services/CipherAndHash.service';

@Injectable()
@EventSubscriber()
export class OrderPersonalDataSubscriber
  implements EntitySubscriberInterface<Order>
{
  constructor(private readonly cipher: CipherAndHashService) {}

  listenTo(): typeof Order {
    return Order;
  }

  beforeInsert(event: InsertEvent<Order>): void {
    this.encrypt(event.entity);
  }

  beforeUpdate(event: UpdateEvent<Partial<Order>>): void {
    if (!event.entity) return;
    this.encrypt(event.entity);
  }

  afterLoad(entity: Order): void {
    this.decrypt(entity);
  }

  private encrypt(entity: Partial<Order>) {
    if (entity.phone) {
      entity.phone = this.cipher.encryptText(entity.phone);
    }
    if (entity.email) {
      entity.email = this.cipher.encryptText(entity.email);
    }
    if (entity.addressFull) {
      entity.addressFull = this.cipher.encryptText(entity.addressFull);
    }
    if (entity.addressClarification) {
      entity.addressClarification = this.cipher.encryptText(
        entity.addressClarification,
      );
    }
  }
  private decrypt(entity: Order) {
    if (entity.phone) {
      entity.phone = this.cipher.decryptText(entity.phone);
    }
    if (entity.email) {
      entity.email = this.cipher.decryptText(entity.email);
    }
    if (entity.addressFull) {
      entity.addressFull = this.cipher.decryptText(entity.addressFull);
    }
    if (entity.addressClarification) {
      entity.addressClarification = this.cipher.decryptText(
        entity.addressClarification,
      );
    }
  }
}
