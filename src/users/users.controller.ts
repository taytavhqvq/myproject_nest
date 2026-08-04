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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
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
  findOne(@Param('userid', ParseUUIDPipe) userid: string) {
    return this.usersService.findOne(userid);
  }

  @Patch(':userid')
  @HttpCode(200)
  update(
    @Param('userid', ParseUUIDPipe) userid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(userid, updateUserDto);
  }

  @Delete(':userid')
  @HttpCode(200)
  remove(@Param('userid', ParseUUIDPipe) userid: string) {
    return this.usersService.remove(userid);
  }
}
