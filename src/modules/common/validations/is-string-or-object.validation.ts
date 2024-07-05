import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsStringOrObject(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStringOrObject',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' || typeof value === 'object';
        },
        defaultMessage() {
          return `$property must be a string or an object`;
        },
      },
    });
  };
}
