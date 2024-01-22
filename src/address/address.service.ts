import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AddressDTO } from './address.dto';

@Injectable()
export class AddressService {
  constructor(private prismaService: PrismaService) {}

  async create(userId: string, address: AddressDTO) {
    //alamat yang maksimal 2
    const countAddress = await this.prismaService.address.count({
      where: {
        userId,
      },
    });
    // console.log(countAddress);

    if (countAddress < 2) {
      const newAddress = await this.prismaService.address.create({
        data: {
          userId,
          address: address.address,
          provinceId: address.provinceId,
          cityId: address.cityId,
          subDistrictId: address.subDistrictId,
        },
      });
      return newAddress;
    } else {
      throw new Error();
    }
  }

  async update(address: AddressDTO) {
    return this.prismaService.address.update({
      where: {
        id: address.id,
      },
      data: {
        ...address,
      },
    });
  }
  async isRegionValid(address: AddressDTO) {
    //cek apakah provinsi dan city benar

    const existingProvince =
      await this.prismaService.province.findUniqueOrThrow({
        where: {
          id: address.provinceId,
        },
      });
    // return !!existingProvince;

    const existingCity = await this.prismaService.city.findFirstOrThrow({
      where: {
        id: address.cityId,
      },
    });

    const existingSubdistric =
      await this.prismaService.subDistrict.findFirstOrThrow({
        where: {
          id: address.subDistrictId,
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
