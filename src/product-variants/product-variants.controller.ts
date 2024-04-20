import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  BadRequestException,
  Body,
  Param,
  Query,
  ParseIntPipe,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ProductVariantsService } from './product-variants.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Role } from 'src/role/role.decorator';
import { Role as RoleEnum } from 'src/constant';
import { RoleGuard } from 'src/role/role.guard';
import { ProductVariantsDTO } from './product-variants.dto';

@Role(RoleEnum.ADMIN)
@UseGuards(JwtGuard, RoleGuard)
@Controller('product-variants')
export class ProductVariantsController {
  constructor(private productVariantsService: ProductVariantsService) {}

  @Get()
  async all(@Query('product') product: string) {
    return await this.productVariantsService.all(product);
  }

  @Post()
  async addVariant(@Body() data: ProductVariantsDTO) {
    try {
      const result = await this.productVariantsService.addVariant(data);
      return result;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Put(':variantId')
  async editVariant(
    @Param(
      'variantId',
      new ParseIntPipe({
        exceptionFactory: () =>
          new NotAcceptableException('Variant ID must be a number'),
      }),
    )
    variantId: number,
    @Body() data: ProductVariantsDTO,
  ) {
    try {
      const result = await this.productVariantsService.editVariant(
        variantId,
        data,
      );
      return result;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Delete(':variantId')
  async deleteVariant(
    @Param(
      'variantId',
      new ParseIntPipe({
        exceptionFactory: () =>
          new NotAcceptableException('Variant ID must be a number'),
      }),
    )
    variantId: number,
  ) {
    try {
      return await this.productVariantsService.deleteVariant(variantId);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
