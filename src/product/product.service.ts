import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductDTO } from './product.dto';

import * as _ from 'lodash';
import { Product } from '@prisma/client';
import { ProductImagesService } from 'src/product-images/product-images.service';
import { FirebaseService } from 'src/firebase.service';

export interface ProductType extends Product {
  category: string;
  image?: string;
  price?: number;
  oldPrice?: number;
}

@Injectable()
export class ProductService {
  constructor(
    private prismaService: PrismaService,
    private firebaseService: FirebaseService,
    private productImagesService: ProductImagesService,
  ) {}

  async get(
    page: number,
    perPage: number,
    orderQuery: string,
    search: string,
    category: number,
    relation: boolean,
  ) {
    const offset = (page - 1) * perPage;
    const innerOrLeft = relation ? 'INNER' : 'LEFT';
    const variantClause = `WITH MinPricedVariants AS (
      SELECT
          product_id,
          MIN(price) AS min_price
      FROM
          product_variants
      WHERE
          stock > 0 AND is_active = TRUE
      GROUP BY
          product_id
  ),`;

    const imageClause = `FirstImage AS (
        SELECT
            product_id,
            image,
            ROW_NUMBER() OVER(PARTITION BY product_id ORDER BY id ASC) AS img_rank
        FROM
            product_images
    )`;

    let whereClause = '';
    const conditions = [];

    if (search) {
      conditions.push(`p.name ILIKE '%${search}%'`);
    }

    if (category) {
      conditions.push(`p.category_id = ${category}`);
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    const query = `${variantClause} ${imageClause} SELECT
      p.id,
      p.name,
      p.slug,
      p.excerpt,
      p.is_featured AS "isFeatured",
      p.is_active AS "isActive",
      c.name AS "category",
      fi.image,
      COALESCE(mpv.min_price, pv.price) AS price,
      pv.old_price AS "oldPrice"
    FROM
      products p 
      ${innerOrLeft} JOIN categories c ON c.id = p.category_id
      ${innerOrLeft} JOIN MinPricedVariants mpv ON p.id = mpv.product_id
      ${innerOrLeft} JOIN product_variants pv ON p.id = pv.product_id AND pv.price = mpv.min_price
      ${innerOrLeft} JOIN FirstImage fi ON p.id = fi.product_id AND fi.img_rank = 1
    ${whereClause} ORDER BY ${orderQuery} LIMIT ${perPage} OFFSET ${offset}`;

    const data: ProductType[] = await this.prismaService.$queryRawUnsafe(query);
    const productImage = await Promise.all(
      data.map(async (product) => {
        if (product.image) {
          const image = product.image;
          const imageUrl = await this.firebaseService.getDownloadUrl(image);
          return { ...product, image: imageUrl };
        }
        return product;
      }),
    );
    const totalQuery: number = await this.prismaService.$queryRawUnsafe(`
    ${variantClause}  ${imageClause} 
    SELECT
        COUNT(*)::int AS total
    FROM
        products p
        ${innerOrLeft} JOIN categories c ON c.id = p.category_id
        ${innerOrLeft} JOIN MinPricedVariants mpv ON p.id = mpv.product_id
        ${innerOrLeft} JOIN product_variants pv ON p.id = pv.product_id AND pv.price = mpv.min_price
        ${innerOrLeft} JOIN FirstImage fi ON p.id = fi.product_id AND fi.img_rank = 1
        ${whereClause}`);
    const totalResult = totalQuery[0]?.total ?? 0;
    const pageCount = Math.ceil(totalResult / perPage);
    return {
      data: productImage,
      pagination: {
        isFirstPage: page === 1,
        isLastPage: page === pageCount,
        firstResult: (page - 1) * perPage + 1,
        lastResult: Math.min(page * perPage, totalResult),
        totalResult: totalResult,
        pageCount,
        currentPage: page,
        perPage,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < pageCount ? page + 1 : null,
      },
    };
  }

  async findProductById(id: string) {
    const result = await this.prismaService.product.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        category: true,
        city: true,
        province: true,
        subdistrict: true,
        productImages: true,
        productVariants: true,
      },
    });
    return result;
  }

  async findProductBySlug(slug: string) {
    const result = await this.prismaService.product.findUniqueOrThrow({
      where: {
        slug,
      },
      include: {
        productVariants: {
          where: {
            stock: {
              gt: 0,
            },
            isActive: true,
          },
        },
        category: true,
        city: true,
        province: true,
        subdistrict: true,
        productImages: true,
      },
    });

    const defaultVariant = _.minBy(
      result.productVariants,
      (variant) => variant.price,
    );

    const productVariants = _.groupBy(
      result.productVariants,
      (variant) => variant.size,
    );

    const images = await this.productImagesService.getAllImageByProducttId(
      result.id,
    );

    return {
      ...result,
      productVariants,
      price: defaultVariant.price,
      oldPrice: defaultVariant.oldPrice,
      productImages: images,
    };
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
