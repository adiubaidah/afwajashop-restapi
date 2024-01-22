import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  ForbiddenException,
  Delete,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/user.dto';
import { LoginDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { extractFromCookie } from 'src/helper';
import { JWT_EXPIRE } from 'src/constant';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async registerUser(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(dto);
    res.cookie('access_token', `${process.env.TOKEN_TYPE} ${token}`, {
      domain: process.env.DOMAIN,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: JWT_EXPIRE,
    });
    return {
      statusCode: 200,
      message: 'Login berhasil',
    };
  }

  @Post('is-not-auth')
  checkIsNotAuth(@Req() request: Request) {
    //check apakah belum terautentikasi
    if (request.cookies.access_token) {
      const token = extractFromCookie(request);
      if (token) {
        throw new ForbiddenException();
      }
    }
    return true;
  }

  @Delete('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      domain: process.env.DOMAIN,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });

    return {
      statusCode: 200,
      message: 'Logout berhasil',
    };
  }
}
