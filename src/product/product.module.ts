import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegionService } from 'src/region/region.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, JwtService, RegionService],
})
export class ProductModule {}
