import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { Film, FilmSchema } from './films.mongo.schema';
import { FilmsMongoRepository } from './films.mongo.repository';
import { FILMS_REPOSITORY } from './films.repository.interface';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        uri: cfg.get<string>('DATABASE_URL', 'mongodb://localhost:27017/prac'),
      }),
    }),
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  providers: [
    FilmsMongoRepository,
    {
      provide: FILMS_REPOSITORY,
      useExisting: FilmsMongoRepository,
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class MongoRepositoryModule {}
