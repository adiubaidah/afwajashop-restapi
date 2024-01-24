import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
export class ProductVariantsDTO {
  @IsOptional()
  @IsString({ message: 'Nama tidak valid' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Size tidak valid' })
  size: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: 'Stok diperlukan' })
  stock: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: 'Harga diperlukan' })
  price: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber({}, { message: 'Harga lama tidak valid' })
  oldPrice: number;

  @IsString()
  productId: string;
}
