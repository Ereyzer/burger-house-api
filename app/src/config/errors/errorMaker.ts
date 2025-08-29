import { HttpException, HttpStatus } from '@nestjs/common';

class MyError extends HttpException {
  constructor(message: string, name: string, status: HttpStatus) {
    super({ message, error: name, status }, status);
  }
}

export const makeError = (
  defoultMessage: string,
  defoultName: string,
  defoultStatus: HttpStatus,
): new (message?: string) => MyError => {
  return class extends MyError {
    constructor(message?: string) {
      super(message || defoultMessage, defoultName, defoultStatus);
    }
  };
};
