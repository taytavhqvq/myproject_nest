import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ProvincesService } from './provinces.service';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('provinces')
@UseGuards(JwtAuthGuard)
export class ProvincesController {
  constructor(private readonly provincesService: ProvincesService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createProvinceDto: CreateProvinceDto) {
    return this.provincesService.create(createProvinceDto);
  }

  @Get()
  @HttpCode(200)
  findAll() {
    return this.provincesService.findAll();
  }

  @Get(':provinceid')
  @HttpCode(200)
  findOne(@Param('provinceid', ParseUUIDPipe) provinceid: string) {
    return this.provincesService.findOne(provinceid);
  }

  @Patch(':provinceid')
  @HttpCode(200)
  update(
    @Param('provinceid', ParseUUIDPipe) provinceid: string,
    @Body() updateProvinceDto: UpdateProvinceDto,
  ) {
    return this.provincesService.update(provinceid, updateProvinceDto);
  }

  @Delete(':provinceid')
  @HttpCode(200)
  remove(@Param('provinceid', ParseUUIDPipe) provinceid: string) {
    return this.provincesService.remove(provinceid);
  }
}
