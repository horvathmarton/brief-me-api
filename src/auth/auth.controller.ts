import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { compareSync } from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from '../db/models';
import { LoginPayload, TokenResponse } from '../shared/payloads';
import { ApiResponsePayload } from '../shared/types';
import { AuthService } from './auth.service';
import { Role } from './roles/roles.decorator';

@Controller({ path: 'auth', version: '1' })
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly dataSource: DataSource,
  ) {}

  @Post('login')
  @Role('anonymous')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Logged in successfully.',
    type: TokenResponse,
  })
  @ApiBadRequestResponse({ description: 'Malformed payload.' })
  @ApiUnauthorizedResponse({ description: 'Invalid username or password.' })
  public async signIn(
    @Body() payload: LoginPayload,
  ): Promise<ApiResponsePayload<TokenResponse>> {
    const { username, password } = payload;

    const user = await this.dataSource.getRepository(User).findOne({
      where: { username },
    });

    if (!user) throw new UnauthorizedException('Invalid username or password.');

    const passwordCorrect = compareSync(password, user.passwordHash);

    if (!passwordCorrect) {
      throw new UnauthorizedException('Invalid username or password.');
    }

    return {
      payload: new TokenResponse({
        token: this.authService.createToken(user.id, username, user.isAdmin),
      }),
    };
  }
}
