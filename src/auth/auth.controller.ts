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
import { JWT_EXPIRE, JWT_SECRET_KEY } from 'src/constant';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private jwtService: JwtService,
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
    const user = await this.authService.login(dto);
    const token = await this.jwtService.signAsync(user, {
      expiresIn: JWT_EXPIRE,
      secret: JWT_SECRET_KEY,
    });
    res.cookie('access_token', `${process.env.TOKEN_TYPE} ${token}`, {
      domain: process.env.DOMAIN,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //untuk produksi
      maxAge: JWT_EXPIRE,
    });
    return {
      statusCode: 200,
      message: 'Login berhasil',
      role: user.role,
    };
  }

  @Post('is-auth')
  async checkIsAuth(
    @Body() body: { token: { name: string; value: string } },
    @Req() req: Request,
  ) {
    const token =
      req.cookies['access_token'] ?? (body.token ? body.token.value : null);
    if (token) {
      const access_token = token.split(' ')[1];
      const user = this.jwtService.verify(access_token, {
        publicKey: process.env.JWT_SECRET_KEY,
      });
      return user;
    }
    return false;
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
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //untuk produksi
    });

    return {
      statusCode: 200,
      message: 'Logout berhasil',
    };
  }
}
