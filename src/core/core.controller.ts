import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponsePayload } from 'src/shared/types';
import * as packageInfo from '../../package.json';
import { Role } from '../auth/roles';

@Controller({ version: VERSION_NEUTRAL })
@ApiTags('core')
export class CoreController {
  @Get()
  @Role('anonymous')
  @ApiOkResponse({ description: 'Instance is healthy.' })
  @ApiInternalServerErrorResponse({ description: 'Instance is down.' })
  public healthCheck(): ApiResponsePayload<{ status: string }> {
    return {
      payload: {
        status: 'ok',
      },
    };
  }

  @Get('version')
  @Role('anonymous')
  @ApiOkResponse({ description: 'API version info fetched successfully.' })
  public version(): ApiResponsePayload<{ version: string; commit: string }> {
    return {
      payload: {
        version: packageInfo.version,
        commit: packageInfo.commit,
      },
    };
  }
}
