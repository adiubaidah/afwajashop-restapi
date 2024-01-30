import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductDTO } from './product.dto';
import {
  PaginateFunction,
  paginator,
  PaginatedResult,
} from 'src/lib/paginator';
import { Prisma, Product } from '@prisma/client';
import { ProductImagesService } from 'src/product-images/product-images.service';
import { FirebaseService } from 'src/firebase.service';
const paginate: PaginateFunction = paginator({ perPage: 10 });

export interface ProductType extends Product {
  productImages: { image: string }[];
  imageUrl?: string;
}

@Injectable()
export class ProductService {
  constructor(
    private prismaService: PrismaService,
    private firebaseService: FirebaseService,
    private productImagesService: ProductImagesService,
  ) {}

  async getAll({
    where,
    orderBy,
    include,
    page,
    perPage,
  }: {
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
    include?: Prisma.ProductInclude;
    page?: number;
    perPage?: number;
  } = {}): Promise<PaginatedResult<ProductType>> {
    const products: PaginatedResult<ProductType> = await paginate(
      this.prismaService.product,
      { where, orderBy, include },
      { page, perPage },
    );
    const productWithImage = await Promise.all(
      products.data.map(async (product: ProductType) => {
        if (product.productImages && product.productImages.length > 0) {
          const image = product.productImages[0].image;
          const imageUrl = await this.firebaseService.getDownloadUrl(image);
          product.imageUrl = imageUrl;
        }
        return product;
      }),
    );

    products.data = productWithImage;
    return products;
  }

  async findProductById(id: string) {
    const result = await this.prismaService.product.findUniqueOrThrow({
      where: {
        id,
      },
      // include: {
      //   ProductVariants: true,
      // },
    });
    return result;
  }

  async findProductBySlug(slug: string) {
    const result = await this.prismaService.product.findUniqueOrThrow({
      where: {
        slug,
      },
      include: {
        productVariants: true,
      },
    });
    const images = await this.productImagesService.getAllImageByProducttId(
      result.id,
    );

    return { ...result, ProductImages: images };
  }

  async addProduct(product: ProductDTO) {
    const { cityId, provinceId, subDistrictId, categoryId, ...data } = product;
    const result = await this.prismaService.product.create({
      data: {
        ...data,
        category: {
          connect: {
            id: categoryId,
          },
        },
        city: {
          connect: {
            id: cityId,
          },
        },
        province: {
          connect: {
            id: provinceId,
          },
        },
        subdistrict: {
          connect: {
            id: subDistrictId,
          },
        },
      },
    });

    return result;
  }

  async updateProduct(id: string, product: ProductDTO) {
    const { cityId, provinceId, subDistrictId, categoryId, ...data } = product;
    const result = await this.prismaService.product.update({
      where: {
        id,
      },
      data: {
        ...data,
        category: {
          connect: {
            id: categoryId,
          },
        },
        city: {
          connect: {
            id: cityId,
          },
        },
        province: {
          connect: {
            id: provinceId,
          },
        },
        subdistrict: {
          connect: {
            id: subDistrictId,
          },
        },
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
