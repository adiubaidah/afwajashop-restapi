import {
  Controller,
  Get,
  Query,
  ValidationPipe,
  UsePipes,
  NotFoundException,
} from '@nestjs/common';
import { RegionService } from './region.service';
import { CityQuery, ProvinceQuery, SubdistrictQuery } from './region.dto';

@Controller('region')
export class RegionController {
  constructor(private regionService: RegionService) {}

  @Get('provinces')
  @UsePipes(new ValidationPipe({ transform: true }))
  async provinces(@Query() query: ProvinceQuery) {
    const { id } = query;
    if (id) {
      return this.regionService.findProvince(id);
    }
    return this.regionService.getProvinces();
  }

  @Get('cities')
  @UsePipes(new ValidationPipe({ transform: true }))
  async cities(@Query() query: CityQuery) {
    const { province, id } = query;

    if (id) {
      return this.regionService.findCity(id);
    }

    if (province !== 0) {
      return this.regionService.getCities(province);
    }

    throw new NotFoundException('City or Province not found.');
  }

  @Get('subdistricts')
  @UsePipes(new ValidationPipe({ transform: true }))
  async subdistricts(@Query() query: SubdistrictQuery) {
    const { city, id } = query;
    if (id) {
      return this.regionService.findSubdistrict(id);
    }

    if (city !== 0) {
      return this.regionService.getSubdistricts(city);
    }
    throw new NotFoundException('Subdistrict or City not found.');
  }
}
