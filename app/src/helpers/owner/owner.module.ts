import { Module } from '@nestjs/common';
import { Owner } from './owner';

@Module({
  providers: [Owner],
})
export class OwnerModule {}
