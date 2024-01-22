import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from 'src/firebase.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, PrismaService, JwtService, FirebaseService],
})
export class ProfileModule {}
