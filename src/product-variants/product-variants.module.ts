import { Module } from '@nestjs/common';
import { ProductVariantsController } from './product-variants.controller';
import { ProductVariantsService } from './product-variants.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ProductService } from 'src/product/product.service';

@Module({
  controllers: [ProductVariantsController],
  providers: [
    ProductVariantsService,
    PrismaService,
    JwtService,
    ProductService,
  ],
})
export class ProductVariantsModule {}
