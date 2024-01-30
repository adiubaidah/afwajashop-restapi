import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ProductImagesService } from 'src/product-images/product-images.service';
import { FirebaseService } from 'src/firebase.service';
@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductImagesService,
    PrismaService,
    JwtService,
    FirebaseService,
  ],
})
export class ProductModule {}
