import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class ProvinceQuery {
  @IsOptional()
  @IsNumber({}, { message: 'Query tidak valid' })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  id?: number;
}

export class CityQuery {
  @IsOptional()
  @IsNumber({}, { message: 'Query tidak valid' })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  province?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Query tidak valid' })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  id?: number;
}

export class SubdistrictQuery {
  @IsOptional()
  @IsNumber({}, { message: 'Query tidak valid' })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  city?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Query tidak valid' })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  id?: number;
}
