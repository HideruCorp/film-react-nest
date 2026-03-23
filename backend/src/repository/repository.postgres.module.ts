import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { Film } from './film.postgres.entity';
import { Schedule } from './schedule.postgres.entity';
import { FilmsPostgresRepository } from './films.postgres.repository';
import { FILMS_REPOSITORY } from './films.repository.interface';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres' as const,
        host: cfg.get<string>('DATABASE_HOST', 'localhost'),
        port: cfg.get<number>('DATABASE_PORT', 5432),
        username: cfg.get<string>('DATABASE_USERNAME', 'postgres'),
        password: cfg.get<string>('DATABASE_PASSWORD', ''),
        database: cfg.get<string>('DATABASE_NAME', 'prac'),
        entities: [Film, Schedule],
        // Схема управляется исключительно SQL-скриптами в backend/test/
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  providers: [
    FilmsPostgresRepository,
    {
      provide: FILMS_REPOSITORY,
      useExisting: FilmsPostgresRepository,
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class PostgresRepositoryModule {}
