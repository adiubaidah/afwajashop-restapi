import { Request } from 'express';
export const extractFromCookie = (request: Request) => {
  const [type, token] = request.cookies.access_token.split(' ');
  return type === 'Bearer' ? token : undefined;
  //   return request.cookies.access_token;
};
