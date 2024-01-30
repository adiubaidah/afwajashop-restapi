import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { PrismaService } from 'src/prisma.service';
import { FirebaseService } from 'src/firebase.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [FavoriteController],
  providers: [FavoriteService, PrismaService, FirebaseService, JwtService],
})
export class FavoriteModule {}
