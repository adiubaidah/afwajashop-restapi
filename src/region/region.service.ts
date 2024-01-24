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
  async isRegionValid({
    provinceId,
    cityId,
    subDistrictId,
  }: {
    provinceId: number;
    cityId: number;
    subDistrictId: number;
  }) {
    //cek apakah provinsi dan city benar

    const existingProvince =
      await this.prismaService.province.findUniqueOrThrow({
        where: {
          id: provinceId,
        },
      });
    // return !!existingProvince;

    const existingCity = await this.prismaService.city.findFirstOrThrow({
      where: {
        id: cityId,
      },
    });

    const existingSubdistric =
      await this.prismaService.subDistrict.findFirstOrThrow({
        where: {
          id: subDistrictId,
        },
      });

    const checkValid =
      existingProvince.id === existingCity.provinceId &&
      existingCity.id === existingSubdistric.cityId;

    if (checkValid) {
      return true;
    } else {
      throw new Error();
    }
  }
}
