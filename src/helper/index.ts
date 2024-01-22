import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

export const extractFromCookie = (request: Request) => {
  if (!request.cookies.access_token) {
    throw new UnauthorizedException();
  }
  const [type, token] = request.cookies.access_token.split(' ');
  return type === 'Bearer' ? token : undefined;
  //   return request.cookies.access_token;
};

export function generateString(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
