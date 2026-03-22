import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { GetFilmDTO, GetScheduleDTO } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: jest.Mocked<FilmsService>;

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

  const mockFilmsService = {
    findAll: jest.fn(),
    findSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of films', async () => {
      mockFilmsService.findAll.mockResolvedValue({
        total: mockFilms.length,
        items: mockFilms,
      });

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        total: mockFilms.length,
        items: mockFilms,
      });
    });

    it('should return empty array when no films exist', async () => {
      mockFilmsService.findAll.mockResolvedValue({
        total: 0,
        items: [],
      });

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        total: 0,
        items: [],
      });
    });
  });

  describe('findSchedule', () => {
    it('should return schedule for a valid film id', async () => {
      const filmId = 'film-1';
      mockFilmsService.findSchedule.mockResolvedValue({
        total: mockSchedule.length,
        items: mockSchedule,
      });

      const result = await controller.findSchedule(filmId);

      expect(service.findSchedule).toHaveBeenCalledWith(filmId);
      expect(result).toEqual({
        total: mockSchedule.length,
        items: mockSchedule,
      });
    });

    it('should handle film id with special characters', async () => {
      const filmId = 'film-with-special-chars-123';
      mockFilmsService.findSchedule.mockResolvedValue({
        total: 1,
        items: [mockSchedule[0]],
      });

      const result = await controller.findSchedule(filmId);

      expect(service.findSchedule).toHaveBeenCalledWith(filmId);
      expect(result).toEqual({
        total: 1,
        items: [mockSchedule[0]],
      });
    });
  });
});
