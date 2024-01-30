import { IsString } from 'class-validator';
export class FavoriteDTO {
  @IsString({ message: 'Produk harus ada' })
  productId: string;
}
