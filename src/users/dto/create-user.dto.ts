import { IsNotEmpty, IsString, IsIn, MinLength } from 'class-validator';
import {
  HasLowercase,
  HasUppercase,
  HasNumber,
  HasSpecialChar,
} from '../../common/validators/password.validator';

export enum UserState {
  ADMIN = 'Admin',
  STAFF = 'Staff',
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @HasLowercase()
  @HasUppercase()
  @HasNumber()
  @HasSpecialChar()
  password!: string;

  @IsNotEmpty()
  @IsIn([UserState.ADMIN, UserState.STAFF], {
    message: 'State must be either Admin or Staff',
  })
  state!: string;
}
