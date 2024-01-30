import { Module } from '@nestjs/common';
import { ProductVariantsController } from './product-variants.controller';
import { ProductVariantsService } from './product-variants.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
// import { ProductImagesService } from 'src/product-images/product-images.service';
// import { FirebaseService } from 'src/firebase.service';

@Module({
  controllers: [ProductVariantsController],
  providers: [ProductVariantsService, PrismaService, JwtService],
})
export class ProductVariantsModule {}
