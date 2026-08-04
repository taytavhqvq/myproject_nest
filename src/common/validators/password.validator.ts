import { registerDecorator, ValidationOptions } from 'class-validator';

function createRegexValidator(
  name: string,
  regex: RegExp,
  defaultMessage: string,
) {
  return (validationOptions?: ValidationOptions) => {
    return (object: object, propertyName: string) => {
      registerDecorator({
        name,
        target: object.constructor,
        propertyName,
        options: validationOptions,
        validator: {
          validate(value: unknown) {
            return typeof value === 'string' && regex.test(value);
          },
          defaultMessage() {
            return validationOptions?.message
              ? (validationOptions.message as string)
              : defaultMessage;
          },
        },
      });
    };
  };
}

export const HasLowercase = createRegexValidator(
  'hasLowercase',
  /(?=.*[a-z])/,
  'Password must contain at least 1 lowercase letter',
);

export const HasUppercase = createRegexValidator(
  'hasUppercase',
  /(?=.*[A-Z])/,
  'Password must contain at least 1 uppercase letter',
);

export const HasNumber = createRegexValidator(
  'hasNumber',
  /(?=.*\d)/,
  'Password must contain at least 1 number',
);

export const HasSpecialChar = createRegexValidator(
  'hasSpecialChar',
  /(?=.*[!@#$%^&*(),.?":{}|<>])/,
  'Password must contain at least 1 special character',
);
