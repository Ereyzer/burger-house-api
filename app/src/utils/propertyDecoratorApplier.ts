import { applyDecorators } from '@nestjs/common';

export function GeneralPropertyDecoratorMaker(...args: PropertyDecorator[]) {
  return function () {
    return applyDecorators(...args);
  };
}
