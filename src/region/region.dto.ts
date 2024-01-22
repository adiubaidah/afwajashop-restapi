import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class ProvinceQuery {
  @IsOptional()
  @IsNumber({}, { message: 'Query tidak valid' })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  id?: number;
}

export class CityQuery {
  @IsNumber({}, { message: 'Query tidak valid' })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  provinceId?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Query tidak valid' })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  id?: number;
}

export class SubdistrictQuery {
  @IsNumber({}, { message: 'Query tidak valid' })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  cityId?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Query tidak valid' })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  id?: number;
}
