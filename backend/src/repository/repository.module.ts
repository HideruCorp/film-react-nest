import { Module } from '@nestjs/common';
import { databaseProvider } from './films.mongo.provider';
import { FilmsMongoRepository } from './films.mongo.repository';


@Module({
  providers: [
    databaseProvider,
    {
      provide: FILMS_REPOSITORY,
      useClass: FilmsMongoRepository,
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class RepositoryModule {}
