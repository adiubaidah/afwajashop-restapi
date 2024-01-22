import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
export class AddressDTO {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: 'Harus angka' })
  id: number;

  @IsString({ message: 'Alamat harus ada' })
  address: string;

  @IsNumber({}, { message: 'Provinsi harus ada' })
  provinceId: number;

  @IsNumber({}, { message: 'Kabupate / Kota harus ada' })
  cityId: number;

  @IsNumber({}, { message: 'Kecamatan harus ada' })
  subDistrictId: number;
}
