import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  BadRequestException,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductService } from './product.service';
import { ProductDTO } from './product.dto';
import { Role } from 'src/role/role.decorator';
import { Role as RoleEnum } from 'src/constant';
import { RoleGuard } from 'src/role/role.guard';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RegionService } from 'src/region/region.service';

@Controller('product')
export class ProductController {
  constructor(
    private productService: ProductService,
    private regionService: RegionService,
  ) {}

  @Get()
  async products(
    @Query()
    {
      page,
      perPage,
      orderBy,
      search,
    }: {
      page?: number;
      perPage?: number;
      orderBy?: Prisma.ProductOrderByWithRelationInput;
      search?: string;
    },
  ) {
    return await this.productService.getAll({
      page,
      perPage,
      orderBy,
      where: { name: { contains: search, mode: 'insensitive' } },
    });
  }

  @Get('find')
  async find(@Query() { id, slug }: { id?: string; slug?: string }) {
    if (id) return await this.productService.findProductById(id);
    return await this.productService.findProductBySlug(slug);
  }

  @Post()
  @Role(RoleEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  async addProduct(@Body() data: ProductDTO) {
    try {
      const { cityId, provinceId, subDistrictId } = data;
      await this.regionService.isRegionValid({
        cityId,
        provinceId,
        subDistrictId,
      });
      // console.log(data);
      return await this.productService.addProduct(data);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Put(':productId')
  @Role(RoleEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  async updateProduct(
    @Param() { productId }: { productId: string },
    @Body() data: ProductDTO,
  ) {
    try {
      const { cityId, provinceId, subDistrictId } = data;
      await this.regionService.isRegionValid({
        cityId,
        provinceId,
        subDistrictId,
      });
      return await this.productService.updateProduct(productId, data);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Delete(':productId')
  @Role(RoleEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  async deleteProduct(@Param() { productId }: { productId: string }) {
    return await this.productService.deleteProduct(productId);
  }
}
