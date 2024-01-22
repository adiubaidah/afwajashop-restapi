import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ProfileGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const {
      user,
      params: { userId },
    } = context.switchToHttp().getRequest();
    // console.log(userId)
    if (!user) {
      throw new UnauthorizedException();
    }

    return user.id === userId;
  }
}
