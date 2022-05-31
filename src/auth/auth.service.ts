import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { sign, verify } from 'jsonwebtoken';

interface Token {
  username: string;
  isAdmin: boolean;
}

@Injectable()
export class AuthService {
  // TODO: Read me from env!
  private readonly JWT_SECRET = 'my-secret';

  public createToken(username: string, isAdmin: boolean): string {
    return sign({ username, isAdmin }, this.JWT_SECRET, {
      expiresIn: '10 minutes',
    });
  }

  public decodeToken(token: string): Token {
    try {
      return verify(token, this.JWT_SECRET) as Token;
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
}
