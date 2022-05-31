import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as models from './models';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        synchronize: true,
        entities: [...Object.values(models)],
        ssl:
          process.env.NODE_ENV === 'local'
            ? false
            : { rejectUnauthorized: false },
      }),
    }),
  ],
})
export class DbModule {}
