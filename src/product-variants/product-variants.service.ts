import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductVariantsDTO } from './product-variants.dto';

@Injectable()
export class ProductVariantsService {
  constructor(private prismaService: PrismaService) {}

  async addVariant(data: ProductVariantsDTO) {
    const result = await this.prismaService.productVariants.create({
      data: {
        ...data,
      },
    });
    return result;
  }

  async editVariant(id: number, data: ProductVariantsDTO) {
    const result = await this.prismaService.productVariants.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
    return result;
  }

  async deleteVariant(id: number) {
    const result = await this.prismaService.productVariants.delete({
      where: {
        id,
      },
    });
    return result;
  }
}
