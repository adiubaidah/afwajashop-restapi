import {
  Controller,
  Req,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/jwt.guard';
import { FavoriteService } from './favorite.service';
import { FavoriteDTO } from './favorite.dto';

@UseGuards(JwtGuard)
@Controller('favorite')
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  @Get()
  async getAllCart(@Req() req: Request) {
    //By User id
    return await this.favoriteService.getFavorite(req['user'].id);
  }

  @Post()
  async createFavorite(@Req() req: Request, @Body() data: FavoriteDTO) {
    try {
      return await this.favoriteService.addFavorite(req['user'].id, data);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Put(':favoriteId')
  async editFavorite(
    @Param() { favoriteId }: { favoriteId: string },
    @Body() data: FavoriteDTO,
  ) {
    try {
      return await this.favoriteService.editFavorite(favoriteId, data);
    } catch (error) {
      throw new BadRequestException();
    }
  }
  @Delete(':favoriteId')
  async deleteFavorite(@Param() { favoriteId }: { favoriteId: string }) {
    try {
      return await this.favoriteService.deleteFavorite(favoriteId);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
