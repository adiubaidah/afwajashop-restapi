import {
  Get,
  Post,
  Delete,
  Controller,
  Param,
  UseGuards,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  ParseFilePipeBuilder,
  BadRequestException,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CustomUploadFileTypeValidator } from 'src/lib/file.validator';
import { ProductImagesService } from './product-images.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Role } from 'src/role/role.decorator';

import {
  Role as RoleEnum,
  MAX_PROFILE_PICTURE_SIZE_IN_BYTES,
  VALID_UPLOADS_MIME_TYPES,
} from 'src/constant';
import { ProductImagesDTO, GetImageQuery } from './product-images.dto';

@Controller('product-images')
export class ProductImagesController {
  constructor(private productImagesService: ProductImagesService) {}

  @Get()
  async get(@Query() { id, product }: GetImageQuery) {
    if (id || product) {
      if (product)
        return await this.productImagesService.getAllImageByProducttId(product);
      return await this.productImagesService.findImage(id);
    } else {
      throw new NotFoundException();
    }
  }

  @Post()
  @Role(RoleEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Body() data: ProductImagesDTO,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new CustomUploadFileTypeValidator({
            fileType: VALID_UPLOADS_MIME_TYPES,
          }),
        )
        .addMaxSizeValidator({ maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    image: Express.Multer.File,
  ) {
    // console.log(image);
    try {
      return await this.productImagesService.createImage(data, image);
    } catch (error) {
      throw new BadRequestException(error);
    }
    // return await this.productImagesService.createImage(data, image);
  }

  @Delete(':id')
  @Role(RoleEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  async deleteImage(@Param('id') id: number) {
    try {
      return await this.productImagesService.deleteImage(id);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
