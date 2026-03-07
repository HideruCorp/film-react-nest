import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { FilmsService } from './films/films.service';
import { FilmsController } from './films/films.controller';
import { FilmsModule } from './films/films.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      serveRoot: '/content',
    }),
    FilmsModule,
  ],
  controllers: [FilmsController],
  providers: [configProvider, FilmsService],
})
export class AppModule {}
