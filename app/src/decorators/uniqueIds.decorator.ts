import { registerDecorator, ValidationOptions } from 'class-validator';

const getIds = <T extends { id: number | string }>({ id }: T) => id;

export function UniqueIds(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: UniqueIds.name,
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value) {
          if (!Array.isArray(value)) return false;
          const ids = value.map(getIds);
          const unique = new Set(ids);
          return ids.length === unique.size;
        },
        defaultMessage() {
          return `list '${propertyName}' contains duplicate ids`;
        },
      },
    });
  };
}
