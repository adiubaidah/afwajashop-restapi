import { IsString, IsNumber } from 'class-validator';
export class CartDTO {
  @IsString({ message: 'Produk harus ada' })
  productId: string;

  @IsNumber({}, { message: 'Varian produk harus ada' })
  productVariantId: number;

  @IsNumber({}, { message: 'Kuanttias harus angka' })
  quantity: number;
}
