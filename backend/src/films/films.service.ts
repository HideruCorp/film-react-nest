import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IFilmsRepository } from '../repository/films.repository.interface';
import { GetFilmsResponseDTO, GetScheduleResponseDTO } from './dto/films.dto';
import { FILMS_REPOSITORY } from '../repository/repository.module';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: IFilmsRepository,
  ) {}

  async findAll(): Promise<GetFilmsResponseDTO> {
    const items = await this.filmsRepository.findAll();
    return { total: items.length, items };
  }

  async findSchedule(filmId: string): Promise<GetScheduleResponseDTO> {
    const items = await this.filmsRepository.findSchedule(filmId);
    if (!items.length) {
      throw new NotFoundException(`Фильм с id ${filmId} не найден`);
    }
    return { total: items.length, items };
  }
}
