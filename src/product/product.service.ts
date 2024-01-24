import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductDTO } from './product.dto';
import {
  PaginateFunction,
  paginator,
  PaginatedResult,
} from 'src/lib/paginator';
import { Prisma, Product } from '@prisma/client';
const paginate: PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async getAll({
    where,
    orderBy,
    page,
    perPage,
  }: {
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
    page?: number;
    perPage?: number;
  } = {}): Promise<PaginatedResult<Product>> {
    return await paginate(
      this.prismaService.product,
      { where, orderBy },
      { page, perPage },
    );
  }

  async findProductById(id: string) {
    const result = await this.prismaService.product.findUniqueOrThrow({
      where: {
        id,
      },
    });
    return result;
  }

  async findProductBySlug(slug: string) {
    const result = await this.prismaService.product.findUniqueOrThrow({
      where: {
        slug,
      },
    });
    return result;
  }

  async addProduct(product: ProductDTO) {
    const result = await this.prismaService.product.create({
      data: {
        ...product,
      },
    });

    return result;
  }

  async updateProduct(id: string, product: ProductDTO) {
    const result = await this.prismaService.product.update({
      where: {
        id,
      },
      data: {
        ...product,
      },
    });
    return result;
  }

  async deleteProduct(id: string) {
    const result = await this.prismaService.product.delete({
      where: {
        id,
      },
    });
    return result;
  }
}
