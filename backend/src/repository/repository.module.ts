import { Module } from '@nestjs/common';
import { FilmsMemoryRepository } from './films.memory.repository';

@Module({
  providers: [FilmsMemoryRepository],
  exports: [FilmsMemoryRepository],
})
export class RepositoryModule {}
