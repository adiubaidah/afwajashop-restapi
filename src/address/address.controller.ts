import {
  BadRequestException,
  Body,
  Controller,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AddressService } from './address.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { AddressDTO } from './address.dto';

interface RequestType extends Request {
  user: {
    id: string;
    email: string;
    role: 'ADMIN' | 'USER';
    iat: number;
    exp: number;
  };
}

@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Put()
  @UseGuards(JwtGuard)
  async upsert(@Req() request: RequestType, @Body() data: AddressDTO) {
    const {
      user: { id: userId },
    } = request;
    try {
      if (data.id) {
        return await this.addressService.update(data);
      }
      return await this.addressService.create(userId, data);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
