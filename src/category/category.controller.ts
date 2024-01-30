import {
  Get,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Put,
  Param,
  BadRequestException,
  ParseIntPipe,
  NotAcceptableException,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryService } from './category.service';
import { Role } from 'src/role/role.decorator';
import { Role as RoleEnum } from 'src/constant';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/role/role.guard';
import { CategoryDTO } from './category.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async getCategory() {
    return await this.categoryService.allCategory();
  }

  @Post()
  @Role(RoleEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image'))
  async addCategory(
    @Body() data: CategoryDTO,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('Gambar harus ada');
    }
    return await this.categoryService.addCategory(data, image);
  }

  @Put(':categoryId')
  @Role(RoleEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image'))
  async editCategory(
    @Param(
      'categoryId',
      new ParseIntPipe({
        exceptionFactory: () =>
          new NotAcceptableException('Category Id must be a number'),
      }),
    )
    categoryId: number,
    @Body() data: CategoryDTO,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.categoryService.editCategory(categoryId, data, image);
  }

  @Delete(':categoryId')
  @Role(RoleEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  async deleteCategory(
    @Param(
      'categoryId',
      new ParseIntPipe({
        exceptionFactory: () =>
          new NotAcceptableException('Category Id must be a number'),
      }),
    )
    categoryId: number,
  ) {
    return await this.categoryService.deleteCategory(categoryId);
  }
}
