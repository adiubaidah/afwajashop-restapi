import { Controller, Req, Get, UseGuards, Delete, Param } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { Role as RoleEnum } from 'src/constant';
import { Role } from 'src/role/role.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @Role(RoleEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  async getAll(@Req() request: Request) {
    console.log(request.query);
    return await this.userService.all();
  }

  @Delete('delete/:id')
  @Role(RoleEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  async deleteUser(@Param() { id }: { id: string }) {
    console.log(id);
  }
}
