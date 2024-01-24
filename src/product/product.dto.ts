import { IsBoolean, IsString, IsNumber } from 'class-validator';
export class ProductDTO {
  @IsString({ message: 'Nama produk harus ada' })
  name: string;

  @IsString({ message: 'Slug produk harus ada' })
  slug: string;

  @IsBoolean({ message: 'Aktif atau tidak' })
  isActive: boolean;

  @IsBoolean({ message: 'Featured atau tidak' })
  isFeatured: boolean;

  @IsBoolean({ message: 'Baru atau tidak' })
  isNew: boolean;

  @IsString({ message: 'Harus ada deskripsi' })
  description: string;

  @IsString({ message: 'Harus ada excerpt' })
  excerpt: string;

  @IsNumber({}, { message: 'Provinsi harus ada' })
  provinceId: number;

  @IsNumber({}, { message: 'Kota harus ada' })
  cityId: number;

  @IsNumber({}, { message: 'Kecamatan harus ada' })
  subDistrictId: number;
}
