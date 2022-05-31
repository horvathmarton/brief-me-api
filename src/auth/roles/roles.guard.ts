import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../shared/types';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private authService: AuthService, private reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<Role>('role', context.getHandler());

    if (!role) {
      throw new BadRequestException('The endpoint has no attached role.');
    }

    if (role === 'anonymous') {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.authService.parseToken(request);

    if (!token) {
      throw new UnauthorizedException('Please log in.');
    }

    const decoded = this.authService.decodeToken(token);

    if (decoded.isAdmin || role === 'user') {
      return true;
    }

    throw new ForbiddenException("You don't have permissions.");
  }
}
