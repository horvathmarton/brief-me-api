import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { ApiResponse } from 'src/shared/types';
import { getRepository } from 'typeorm';
import { User } from '../db/models';
import { LoginPayload } from '../shared/payloads';
import { AuthService } from './auth.service';
import { Role } from './roles/roles.decorator';

interface TokenResponse {
  token: string;
}

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
      payload: { token: this.authService.createToken(username, user.isAdmin) },
    };
  }
}
