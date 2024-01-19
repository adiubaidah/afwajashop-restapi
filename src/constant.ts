export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const JWT_EXPIRE = +process.env.JWT_TOKEN_EXPIRE_HOUR * 60 * 60 * 1000;
export const enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
