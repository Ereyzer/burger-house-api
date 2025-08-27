import { HttpStatus } from '@nestjs/common';

export interface MyErrorInterface extends Error {
  message: string;
  name: string;
  status: HttpStatus;
}
