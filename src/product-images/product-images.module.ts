import { Module } from '@nestjs/common';
import { ProductImagesController } from './product-images.controller';
import { ProductImagesService } from './product-images.service';
import { FirebaseService } from 'src/firebase.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
// import { ProductService } from 'src/product/product.service';
// import { ProductVariantsService } from 'src/product-variants/product-variants.service';

@Module({
  controllers: [ProductImagesController],
  providers: [ProductImagesService, PrismaService, FirebaseService, JwtService],
})
export class ProductImagesModule {}
