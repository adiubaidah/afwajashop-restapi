import { Transform } from 'class-transformer';
import { IsString, IsBoolean } from 'class-validator';
export class CategoryDTO {
  @IsString({ message: 'Nama kategori harus ada' })
  name: string;

  @Transform(({ value }) => value === 'true')
  @IsBoolean({ message: 'Aktif atau tidak' })
  isActive: boolean;
}
