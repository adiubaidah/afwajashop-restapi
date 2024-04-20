import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
export class ProductImagesDTO {
  @IsString()
  productId: string;
}

export class GetImageQuery {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  id: number;

  @IsOptional()
  @IsString()
  product: string;
}
