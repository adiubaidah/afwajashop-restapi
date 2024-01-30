import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Body,
  Req,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/jwt.guard';
import { CartService } from './cart.service';
import { CartDTO } from './cart.dto';

@UseGuards(JwtGuard)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  async getAllCart(@Req() req: Request) {
    //By User id
    return await this.cartService.getCart(req['user'].id);
  }

  @Post()
  async createCart(@Req() req: Request, @Body() data: CartDTO) {
    try {
      return await this.cartService.addCart(req['user'].id, data);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Put(':cartId')
  async editCart(
    @Param() { cartId }: { cartId: string },
    @Body() data: CartDTO,
  ) {
    try {
      return await this.cartService.editCart(cartId, data);
    } catch (error) {
      throw new BadRequestException();
    }
  }
  @Delete(':cartId')
  async deleteCart(@Param() { cartId }: { cartId: string }) {
    try {
      return await this.cartService.deleteCart(cartId);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
