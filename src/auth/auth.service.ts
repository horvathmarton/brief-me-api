import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { sign, verify } from 'jsonwebtoken';

interface Token {
  sub: number;
  username: string;
  isAdmin: boolean;
}

@Injectable()
export class AuthService {
  constructor() {
    const { JWT_SECRET, JWT_EXPIRATION_MINUTES } = process.env;

    if (!JWT_SECRET || !JWT_EXPIRATION_MINUTES) {
      throw new InternalServerErrorException('JWT if not configured properly.');
    }
  }

  public createToken(
    userId: number,
    username: string,
    isAdmin: boolean,
  ): string {
    return sign({ sub: userId, username, isAdmin }, process.env.JWT_SECRET, {
      expiresIn: `${process.env.JWT_EXPIRATION_MINUTES} minutes`,
    });
  }

  public decodeToken(token: string): Token {
    try {
      return verify(token, process.env.JWT_SECRET) as Token;
    } catch (error) {
      throw new UnauthorizedException('JWT token is invalid.');
    }
  }

  public parseToken(request: Request): string | null {
    const authorization = request.headers.authorization;

    if (!authorization || !new RegExp('^Bearer .*$').test(authorization)) {
      return null;
    }

    return authorization.split(' ')[1];
  }

  public isAuthenticated(request: Request): boolean {
    return !!this.parseToken(request);
  }

  public getAuthenticatedUsername(request: Request): string | null {
    const token = this.parseToken(request);

    if (!token) return null;

    return this.decodeToken(token).username;
  }

  public getAuthenticatedUserId(request: Request): number | null {
    const token = this.parseToken(request);

    if (!token) return null;

    return this.decodeToken(token).sub;
  }
}
