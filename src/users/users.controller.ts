import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UserState } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  @Roles(UserState.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @HttpCode(200)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':userid')
  @HttpCode(200)
  findOne(@Param('userid', ParseUUIDPipe) userid: string) {
    return this.usersService.findOne(userid);
  }

  @Patch(':userid')
  @HttpCode(200)
  @Roles(UserState.ADMIN)
  update(
    @Param('userid', ParseUUIDPipe) userid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(userid, updateUserDto);
  }

  @Patch(':userid/restore')
  @HttpCode(200)
  @Roles(UserState.ADMIN)
  restore(@Param('userid', ParseUUIDPipe) userid: string) {
    return this.usersService.restore(userid);
  }

  @Delete(':userid')
  @HttpCode(200)
  @Roles(UserState.ADMIN)
  remove(@Param('userid', ParseUUIDPipe) userid: string) {
    return this.usersService.remove(userid);
  }
}
