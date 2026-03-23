import { Module } from '@nestjs/common';
import { PostgresRepositoryModule } from './repository.postgres.module';
import { MongoRepositoryModule } from './repository.mongo.module';

// DATABASE_DRIVER читается из process.env, а не через ConfigService,
// потому что выбор модуля происходит на этапе сборки графа зависимостей —
// до инициализации NestJS-контейнера. import 'dotenv/config' в main.ts
// гарантирует, что .env уже загружен к этому моменту.
const driver = process.env.DATABASE_DRIVER ?? 'mongodb';
const DbModule =
  driver === 'postgres' ? PostgresRepositoryModule : MongoRepositoryModule;

@Module({
  imports: [DbModule],
  exports: [DbModule],
})
export class RepositoryModule {}
