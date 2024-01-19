import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'Email diperlukan' })
  @IsEmail({}, { message: 'Email tidak valid' })
  email: string;

  @IsString()
  password: string;
}
