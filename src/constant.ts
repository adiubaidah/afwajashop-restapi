export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const JWT_EXPIRE = +process.env.JWT_TOKEN_EXPIRE_HOUR * 60 * 60 * 1000;
export const enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 2 * 1024 * 1024;
export const VALID_UPLOADS_MIME_TYPES = ['image/jpeg', 'image/png'];

export const sortingQuery = {
  'name:asc': 'p.name ASC',
  'name:desc': 'p.name DESC',
  'price:asc': 'p.name ASC',
  'price:desc': 'p.name DESC',
};
