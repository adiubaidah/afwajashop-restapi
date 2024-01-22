import { Module } from '@nestjs/common';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RegionController],
  providers: [RegionService, PrismaService],
})
export class RegionModule {}
