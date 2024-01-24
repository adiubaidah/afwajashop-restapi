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
}
