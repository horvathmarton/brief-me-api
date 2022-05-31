import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth';
import { RolesGuard } from './auth/roles';
import { CategoriesModule } from './categories';
import { CoreModule } from './core';
import { DbModule } from './db';
import { NewsModule } from './news';

@Module({
  imports: [AuthModule, DbModule, CoreModule, CategoriesModule, NewsModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
