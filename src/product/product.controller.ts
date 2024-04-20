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
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDTO } from './product.dto';
import { Role } from 'src/role/role.decorator';
import { Role as RoleEnum, sortingQuery } from 'src/constant';
import { RoleGuard } from 'src/role/role.guard';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async sqlFind(
    @Query('page') pageQuery: number,
    @Query('perPage') perPageQuery: number,
    @Query('order') orderQuery: string,
    @Query('search') search: string,
    @Query('category') category: number,
    @Query('relation') relationQuery: number, //-1 tidak //1 iya
  ) {
    const order = orderQuery || 'name:asc';
    const page = pageQuery || 1;
    const perPage = perPageQuery || 6;
    const relation = relationQuery || 1;
    return await this.productService.get(
      page,
      perPage,
      sortingQuery[order],
      search,
      category,
      relation === 1,
    );
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
      return await this.productService.addProduct(data);
    } catch (error) {
      throw new BadRequestException(error);
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
      return await this.productService.updateProduct(productId, data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':productId')
  @Role(RoleEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  async deleteProduct(@Param() { productId }: { productId: string }) {
    try {
      return await this.productService.deleteProduct(productId);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
