import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const { confirmPassword, ...restDto } = dto;
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: restDto.email,
      },
    });
    // console.log(existingUser)
    if (existingUser) throw new ConflictException('Email telah terpakai');

    if (restDto.password !== confirmPassword)
      throw new BadRequestException('Konfirmasi password tidak cocok');

    const newUser = await this.prisma.user.create({
      data: {
        ...restDto,
        password: await hash(dto.password, 10),
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = newUser;
    return result;
  }

  async all() {
    const users = await this.prisma.user.findMany({
      select: { id: true, email: true, isActive: true, role: true },
    });
    return users;
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }
}
