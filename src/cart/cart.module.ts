import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from 'src/firebase.service';

@Module({
  controllers: [CartController],
  providers: [CartService, PrismaService, JwtService, FirebaseService],
})
export class CartModule {}
