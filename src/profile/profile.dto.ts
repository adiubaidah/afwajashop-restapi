import { IsString, IsPhoneNumber, IsEnum, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { Gender } from '@prisma/client';

export class ProfileDTO {
  @IsString({ message: 'Nama harus diiisi' })
  name: string;

  @IsPhoneNumber('ID')
  phone: string;

  @IsEnum(Gender, { message: 'Gender harus laki - laki atau perempuan' })
  gender: Gender;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  age: number;
}
