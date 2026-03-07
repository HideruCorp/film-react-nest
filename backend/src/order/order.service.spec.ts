import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { OrderService } from './order.service';
import { IFilmsRepository } from '../repository/films.repository.interface';
import { FILMS_REPOSITORY } from '../repository/repository.module';
import { CreateOrderDTO, TicketDTO } from './dto/order.dto';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}));

describe('OrderService', () => {
  let service: OrderService;
  let repository: jest.Mocked<IFilmsRepository>;

  const mockTickets: TicketDTO[] = [
    {
      film: 'film-1',
      session: 'session-1',
      daytime: '2024-01-01T10:00:00Z',
      row: 1,
      seat: 1,
      price: 300,
    },
    {
      film: 'film-1',
      session: 'session-1',
      daytime: '2024-01-01T10:00:00Z',
      row: 1,
      seat: 2,
      price: 300,
    },
  ];

  const mockOrderDTO: CreateOrderDTO = {
    email: 'test@example.com',
    phone: '+7 (123) 456-78-90',
    tickets: mockTickets,
  };

  const mockRepository = {
    bookTickets: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: FILMS_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get(FILMS_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      mockRepository.bookTickets.mockResolvedValue(undefined);

      const result = await service.createOrder(mockOrderDTO);

      expect(repository.bookTickets).toHaveBeenCalledWith(mockTickets);
      expect(result).toEqual({
        total: mockTickets.length,
        items: expect.arrayContaining([
          expect.objectContaining({
            film: mockTickets[0].film,
            session: mockTickets[0].session,
            daytime: mockTickets[0].daytime,
            row: mockTickets[0].row,
            seat: mockTickets[0].seat,
            price: mockTickets[0].price,
            id: expect.any(String),
          }),
          expect.objectContaining({
            film: mockTickets[1].film,
            session: mockTickets[1].session,
            daytime: mockTickets[1].daytime,
            row: mockTickets[1].row,
            seat: mockTickets[1].seat,
            price: mockTickets[1].price,
            id: expect.any(String),
          }),
        ]),
      });
    });

    it('should create order with single ticket', async () => {
      const singleTicketOrder: CreateOrderDTO = {
        email: 'test@example.com',
        phone: '+7 (123) 456-78-90',
        tickets: [mockTickets[0]],
      };

      mockRepository.bookTickets.mockResolvedValue(undefined);

      const result = await service.createOrder(singleTicketOrder);

      expect(repository.bookTickets).toHaveBeenCalledWith([mockTickets[0]]);
      expect(result.total).toBe(1);
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toMatchObject({
        film: mockTickets[0].film,
        session: mockTickets[0].session,
        row: mockTickets[0].row,
        seat: mockTickets[0].seat,
        price: mockTickets[0].price,
      });
      expect(result.items[0].id).toBeDefined();
    });

    it('should throw BadRequestException when booking fails', async () => {
      const errorMessage = 'Место 1:1 уже занято';
      mockRepository.bookTickets.mockRejectedValue(new Error(errorMessage));

      await expect(service.createOrder(mockOrderDTO)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createOrder(mockOrderDTO)).rejects.toThrow(
        errorMessage,
      );
    });

    it('should throw BadRequestException when film not found', async () => {
      const errorMessage = 'Фильм film-1 не найден';
      mockRepository.bookTickets.mockRejectedValue(new Error(errorMessage));

      await expect(service.createOrder(mockOrderDTO)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when session not found', async () => {
      const errorMessage = 'Сеанс session-1 не найден';
      mockRepository.bookTickets.mockRejectedValue(new Error(errorMessage));

      await expect(service.createOrder(mockOrderDTO)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should generate unique IDs for each ticket', async () => {
      (uuidv4 as jest.Mock)
        .mockReturnValueOnce('uuid-1')
        .mockReturnValueOnce('uuid-2');

      mockRepository.bookTickets.mockResolvedValue(undefined);

      const result = await service.createOrder(mockOrderDTO);

      expect(result.items).toHaveLength(2);
      expect(result.items[0].id).not.toBe(result.items[1].id);
    });
  });
});
