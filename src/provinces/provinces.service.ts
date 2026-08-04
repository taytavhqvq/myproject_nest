import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Province } from './entities/province.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProvincesService {
  constructor(
    @InjectRepository(Province)
    private readonly provincesRepository: Repository<Province>,
  ) {}

  async create(createProvinceDto: CreateProvinceDto) {
    const province = this.provincesRepository.create(createProvinceDto);
    return await this.provincesRepository.save(province);
  }

  async findAll() {
    return await this.provincesRepository.find();
  }

  async findOne(provinceid: string) {
    const province = await this.provincesRepository.findOne({
      where: { provinceid },
    });
    if (!province) {
      throw new NotFoundException(`Province with ID ${provinceid} not found`);
    }
    return province;
  }

  async update(provinceid: string, updateProvinceDto: UpdateProvinceDto) {
    const province = await this.provincesRepository.findOne({
      where: { provinceid },
    });
    if (!province) {
      throw new NotFoundException(`Province with ID ${provinceid} not found`);
    }
    Object.assign(province, updateProvinceDto);
    return await this.provincesRepository.save(province);
  }

  async remove(provinceid: string) {
    const province = await this.provincesRepository.findOne({
      where: { provinceid },
    });
    if (!province) {
      throw new NotFoundException(`Province with ID ${provinceid} not found`);
    }
    await this.provincesRepository.softRemove(province);
    return province;
  }
}
