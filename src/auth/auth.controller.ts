import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { getRepository } from 'typeorm';
import { User } from '../db/models';
import { LoginPayload, TokenResponse } from '../shared/payloads';
import { ApiResponse } from '../shared/types';
import { AuthService } from './auth.service';
import { Role } from './roles/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Role('anonymous')
  @HttpCode(200)
  public async signIn(
    @Body() payload: LoginPayload,
  ): Promise<ApiResponse<TokenResponse>> {
    const { username, password } = payload;

    const user = await getRepository(User).findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Invalid username or password.');
    }

    const passwordCorrect = compareSync(password, user.passwordHash);

    if (!passwordCorrect) {
      throw new UnauthorizedException('Invalid username or password.');
    }

    return {
      payload: new TokenResponse({
        token: this.authService.createToken(username, user.isAdmin),
      }),
    };
  }
}
