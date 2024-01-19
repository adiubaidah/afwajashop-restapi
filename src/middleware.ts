import { Injectable, NestMiddleware } from '@nestjs/common';
// import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
// import {decode}
import { extractFromCookie } from './helper';

interface CustomRequest extends Request {
  user: object;
}

@Injectable()
export class Middleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    const token = extractFromCookie(req);
    // if(token) {

    // }
    next();
  }
}
