import { Module } from '@nestjs/common';
import { FilmsMemoryRepository } from './films.memory.repository';

export const FILMS_REPOSITORY = 'FILMS_REPOSITORY';

@Module({
  providers: [
    {
      provide: FILMS_REPOSITORY,
      useClass: FilmsMemoryRepository,
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class RepositoryModule {}
