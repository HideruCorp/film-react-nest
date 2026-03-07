import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FilmsService } from './films.service';
import { IFilmsRepository } from '../repository/films.repository.interface';
import { FILMS_REPOSITORY } from '../repository/repository.module';
import { GetFilmDTO, GetScheduleDTO } from './dto/films.dto';

describe('FilmsService', () => {
  let service: FilmsService;
  let repository: jest.Mocked<IFilmsRepository>;

  const mockFilms: GetFilmDTO[] = [
    {
      id: 'film-1',
      title: 'Test Film 1',
      rating: 4.5,
      director: 'Director 1',
      tags: ['Action', 'Drama'],
      about: 'About film 1',
      description: 'Description 1',
      image: '/images/film1.jpg',
      cover: '/images/cover1.jpg',
    },
    {
      id: 'film-2',
      title: 'Test Film 2',
      rating: 3.8,
      director: 'Director 2',
      tags: ['Comedy'],
      about: 'About film 2',
      description: 'Description 2',
      image: '/images/film2.jpg',
      cover: '/images/cover2.jpg',
    },
  ];

  const mockSchedule: GetScheduleDTO[] = [
    {
      id: 'session-1',
      daytime: '2024-01-01T10:00:00Z',
      hall: 'Hall 1',
      rows: 10,
      seats: 20,
      price: 300,
      taken: ['1:1', '1:2'],
    },
    {
      id: 'session-2',
      daytime: '2024-01-01T14:00:00Z',
      hall: 'Hall 2',
      rows: 8,
      seats: 16,
      price: 250,
      taken: [],
    },
  ];

  const mockRepository = {
    findAll: jest.fn(),
    findSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: FILMS_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    repository = module.get(FILMS_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of films', async () => {
      mockRepository.findAll.mockResolvedValue(mockFilms);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        total: mockFilms.length,
        items: mockFilms,
      });
    });

    it('should return empty array when no films exist', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        total: 0,
        items: [],
      });
    });
  });

  describe('findSchedule', () => {
    it('should return schedule for a valid film id', async () => {
      const filmId = 'film-1';
      mockRepository.findSchedule.mockResolvedValue(mockSchedule);

      const result = await service.findSchedule(filmId);

      expect(repository.findSchedule).toHaveBeenCalledWith(filmId);
      expect(result).toEqual({
        total: mockSchedule.length,
        items: mockSchedule,
      });
    });

    it('should throw NotFoundException when film not found', async () => {
      const filmId = 'non-existent-film';
      mockRepository.findSchedule.mockResolvedValue([]);

      await expect(service.findSchedule(filmId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findSchedule(filmId)).rejects.toThrow(
        `Фильм с id ${filmId} не найден`,
      );
    });

    it('should return empty schedule when film has no sessions', async () => {
      const filmId = 'film-without-sessions';
      mockRepository.findSchedule.mockResolvedValue([]);

      await expect(service.findSchedule(filmId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
