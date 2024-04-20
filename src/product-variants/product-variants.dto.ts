import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
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

  @IsNumber({}, { message: 'Harga diperlukan' })
  price: number;

  @IsOptional()
  @IsNumber({}, { message: 'Harga lama tidak valid' })
  oldPrice: number;

  @IsBoolean({ message: 'Status produk tidak valid' })
  isActive: boolean;
  @IsString()
  productId: string;
}
