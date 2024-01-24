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
    const { provinceId, id } = query;
    if (query) {
      if (id) {
        return this.regionService.findCity(id);
      } else if (provinceId) {
        return this.regionService.getCities(provinceId);
      }
    } else {
      throw new NotFoundException();
    }
  }

  @Get('subdistricts')
  @UsePipes(new ValidationPipe({ transform: true }))
  async subdistricts(@Query() query: SubdistrictQuery) {
    const { cityId, id } = query;
    if (query) {
      if (id) {
        return this.regionService.findSubdistrict(id);
      }
      return this.regionService.getSubdistricts(cityId);
    } else {
      throw new NotFoundException();
    }
  }
}
