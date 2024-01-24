import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegionService } from 'src/region/region.service';

@Module({
  controllers: [AddressController],
  providers: [AddressService, PrismaService, JwtService, RegionService],
})
export class AddressModule {}
