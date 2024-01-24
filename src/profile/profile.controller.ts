import {
  Controller,
  Put,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileDTO } from './profile.dto';
import { CustomUploadFileTypeValidator } from 'src/lib/file.validator';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ProfileGuard } from './profile.guard';
import {
  MAX_PROFILE_PICTURE_SIZE_IN_BYTES,
  VALID_UPLOADS_MIME_TYPES,
} from 'src/constant';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Put(':userId')
  @UseGuards(JwtGuard, ProfileGuard)
  @UseInterceptors(FileInterceptor('image'))
  async upsert(
    @Param() { userId }: { userId: string },
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
    return this.profileService.upsert(userId, newProfile, image);
  }
}
