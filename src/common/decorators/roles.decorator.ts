import { SetMetadata } from '@nestjs/common';
import { UserState } from '../../users/dto/create-user.dto';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserState[]) => SetMetadata(ROLES_KEY, roles);
