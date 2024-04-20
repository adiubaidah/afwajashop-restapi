import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductVariantsDTO } from './product-variants.dto';

@Injectable()
export class ProductVariantsService {
  constructor(private prismaService: PrismaService) {}

  async addVariant(variant: ProductVariantsDTO) {
    const { productId, ...data } = variant;
    const result = await this.prismaService.productVariants.create({
      data: {
        ...data,
        product: {
          connect: {
            id: productId,
          },
        },
      },
    });
    return result;
  }

  async all(productId: string) {
    return await this.prismaService.productVariants.findMany({
      where: {
        productId,
      },
      orderBy: {
        price: 'asc',
      },
    });
  }

  async editVariant(id: number, variant: ProductVariantsDTO) {
    const { productId, ...data } = variant;
    const result = await this.prismaService.productVariants.update({
      where: {
        id,
      },
      data: {
        ...data,
        product: {
          connect: {
            id: productId,
          },
        },
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
