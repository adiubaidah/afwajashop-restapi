import {
  Controller,
  Put,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileDTO } from './profile.dto';
import { CustomUploadFileTypeValidator } from 'src/lib/file.validator';
import { JwtGuard } from 'src/auth/jwt.guard';
import {
  MAX_PROFILE_PICTURE_SIZE_IN_BYTES,
  VALID_UPLOADS_MIME_TYPES,
} from 'src/constant';
import { Request } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Put()
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('image'))
  async upsert(
    @Req() request: Request,
    @Body() newProfile: ProfileDTO,
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
    try {
      return await this.profileService.upsert(
        request['user'].id,
        newProfile,
        image,
      );
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
