import { HttpStatus } from '@nestjs/common';
class MyError extends Error {
  status: HttpStatus;
  constructor(message: string, name: string, status: HttpStatus) {
    super(message);
    this.name = name;
    this.status = status;
  }
}

const makeError = (
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

export const InternalServerError = makeError(
  'Something went wrong',
  'INTERNAL SERVER ERROR',
  HttpStatus.INTERNAL_SERVER_ERROR,
);

export const NotFoundError = makeError(
  'Not Found',
  'NOT FOUND',
  HttpStatus.NOT_FOUND,
);

export const UnprocessableEntityError = makeError(
  'Validation Error',
  'UNPROCESSABLE ENTITY',
  HttpStatus.UNPROCESSABLE_ENTITY,
);

export const BadRequest = makeError(
  'Bad Request',
  'BAD REQUEST',
  HttpStatus.BAD_REQUEST,
);

export const UnauthorizedError = makeError(
  'Unauthorized',
  'UNAUTHORIZED',
  HttpStatus.UNAUTHORIZED,
);

export const ForbiddenError = makeError(
  'Forbidden',
  'FORBIDDEN',
  HttpStatus.FORBIDDEN,
);
