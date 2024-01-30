import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email tidak valid' })
  email: string;

  @IsString({ message: 'Password diperlukan' })
  password: string;

  @IsString({ message: 'Konfirmasi password diperlukan' })
  confirmPassword: string;
}
