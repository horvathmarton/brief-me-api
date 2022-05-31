import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiResponse } from 'src/shared/types';
import { Role } from '../auth/roles';
import * as packageInfo from '../../package.json';

@Controller({ version: VERSION_NEUTRAL })
export class CoreController {
  @Get()
  @Role('anonymous')
  public healthCheck(): ApiResponse<{ status: string }> {
    return {
      payload: {
        status: 'ok',
      },
    };
  }

  @Get('version')
  @Role('anonymous')
  public version(): ApiResponse<{ version: string; commit: string }> {
    return {
      payload: {
        version: packageInfo.version,
        commit: packageInfo.commit,
      },
    };
  }
}
