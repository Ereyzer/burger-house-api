import { Injectable } from '@nestjs/common';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Personnel } from '../entities/personnel.entity';
import { CipherAndHashService } from '../../../services/CipherAndHash.service';

@Injectable()
@EventSubscriber()
export class PersonnelSubscriber
  implements EntitySubscriberInterface<Personnel>
{
  constructor(private readonly cipher: CipherAndHashService) {}

  listenTo(): typeof Personnel {
    return Personnel;
  }

  beforeInsert(event: InsertEvent<Personnel>): void {
    this.encrypt(event.entity);
  }

  beforeUpdate(event: UpdateEvent<Personnel>): void {
    if (event.entity) {
      this.encrypt(event.entity as Personnel);
    }
  }

  afterLoad(entity: Personnel): void {
    this.decrypt(entity);
  }

  private encrypt(entity: Personnel) {
    if (!entity) return;

    if (entity.name) {
      entity.name = this.cipher.encryptText(entity.name);
    }
    if (entity.surname) {
      entity.surname = this.cipher.encryptText(entity.surname);
    }
    if (entity.father_name) {
      entity.father_name = this.cipher.encryptText(entity.father_name);
    }
    if (entity.address) {
      entity.address = this.cipher.encryptText(entity.address);
    }
    if (entity.phone) {
      entity.phone = this.cipher.encryptText(entity.phone);
    }
  }

  private decrypt(entity: Personnel) {
    if (entity.name) {
      entity.name = this.cipher.decryptText(entity.name);
    }
    if (entity.surname) {
      entity.surname = this.cipher.decryptText(entity.surname);
    }
    if (entity.father_name) {
      entity.father_name = this.cipher.decryptText(entity.father_name);
    }
    if (entity.address) {
      entity.address = this.cipher.decryptText(entity.address);
    }
    if (entity.phone) {
      entity.phone = this.cipher.decryptText(entity.phone);
    }
  }
}
