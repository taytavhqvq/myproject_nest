import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
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
  findOne(@Param('userid') userid: number) {
    return this.usersService.findOne(userid);
  }

  @Patch(':userid')
  @HttpCode(200)
  update(
    @Param('userid') userid: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(userid, updateUserDto);
  }

  @Delete(':userid')
  @HttpCode(204)
  remove(@Param('userid') userid: number) {
    return this.usersService.remove(userid);
  }
}
