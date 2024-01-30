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
      const { provinceId, cityId, subDistrictId } = address;
      const newAddress = await this.prismaService.address.create({
        data: {
          address: address.address,
          user: {
            connect: {
              id: userId,
            },
          },
          province: {
            connect: {
              id: provinceId,
            },
          },
          city: {
            connect: {
              id: cityId,
            },
          },
          subdistrict: {
            connect: {
              id: subDistrictId,
            },
          },
        },
      });
      return newAddress;
    } else {
      throw new Error();
    }
  }

  async update(address: AddressDTO) {
    const { provinceId, cityId, subDistrictId } = address;
    return this.prismaService.address.update({
      where: {
        id: address.id,
      },
      data: {
        address: address.address,
        province: {
          connect: {
            id: provinceId,
          },
        },
        city: {
          connect: {
            id: cityId,
          },
        },
        subdistrict: {
          connect: {
            id: subDistrictId,
          },
        },
      },
    });
  }
}
