import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

  async findOne(provinceId: string) {
    const province = await this.provincesRepository.findOne({
      where: { provinceId },
    });
    if (!province) {
      throw new NotFoundException(`Province with ID ${provinceId} not found`);
    }
    return province;
  }

  async update(provinceId: string, updateProvinceDto: UpdateProvinceDto) {
    const province = await this.provincesRepository.findOne({
      where: { provinceId },
    });
    if (!province) {
      throw new NotFoundException(`Province with ID ${provinceId} not found`);
    }
    Object.assign(province, updateProvinceDto);
    return await this.provincesRepository.save(province);
  }

  async remove(provinceId: string) {
    const province = await this.provincesRepository.findOne({
      where: { provinceId },
    });
    if (!province) {
      throw new NotFoundException(`Province with ID ${provinceId} not found`);
    }
    await this.provincesRepository.softRemove(province);
    return null;
  }

  async restore(provinceId: string) {
    const province = await this.provincesRepository.findOne({
      where: { provinceId },
      withDeleted: true,
    });

    if (!province) {
      throw new NotFoundException(`Province with ID ${provinceId} not found`);
    }

    if (!province.deletedAt) {
      throw new BadRequestException(
        `Province with ID ${provinceId} is not deleted`,
      );
    }

    await this.provincesRepository.restore(provinceId);
    return this.findOne(provinceId);
  }
}
