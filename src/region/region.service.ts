import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RegionService {
  constructor(private prismaService: PrismaService) {}

  async getProvinces() {
    const result = await this.prismaService.province.findMany();
    return result;
  }

  async findProvince(provinceId: number) {
    const result = await this.prismaService.province.findUnique({
      where: {
        id: provinceId,
      },
    });
    return result;
  }

  async getCities(provinceId: number) {
    const result = await this.prismaService.city.findMany({
      where: {
        provinceId,
      },
    });
    return result;
  }

  async findCity(cityId: number) {
    const result = await this.prismaService.city.findUnique({
      where: {
        id: cityId,
      },
    });
    return result;
  }

  async getSubdistricts(cityId: number) {
    const result = await this.prismaService.subDistrict.findMany({
      where: {
        cityId,
      },
    });
    return result;
  }

  async findSubdistrict(subDistrictId: number) {
    const result = await this.prismaService.subDistrict.findUnique({
      where: {
        id: subDistrictId,
      },
    });
    return result;
  }
}
