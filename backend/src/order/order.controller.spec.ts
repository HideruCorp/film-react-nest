import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDTO, TicketDTO } from './dto/order.dto';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}));

describe('OrderController', () => {
  let controller: OrderController;
  let service: jest.Mocked<OrderService>;

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

  const mockOrderResponse = {
    total: mockTickets.length,
    items: mockTickets.map((ticket) => ({
      ...ticket,
      id: expect.any(String),
    })),
  };

  const mockOrderService = {
    createOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      mockOrderService.createOrder.mockResolvedValue(mockOrderResponse);

      const result = await controller.createOrder(mockOrderDTO);

      expect(service.createOrder).toHaveBeenCalledWith(mockOrderDTO);
      expect(result).toEqual(mockOrderResponse);
    });

    it('should create order with single ticket', async () => {
      const singleTicketOrder: CreateOrderDTO = {
        email: 'test@example.com',
        phone: '+7 (123) 456-78-90',
        tickets: [mockTickets[0]],
      };

      const singleTicketResponse = {
        total: 1,
        items: [{ ...mockTickets[0], id: expect.any(String) }],
      };

      mockOrderService.createOrder.mockResolvedValue(singleTicketResponse);

      const result = await controller.createOrder(singleTicketOrder);

      expect(service.createOrder).toHaveBeenCalledWith(singleTicketOrder);
      expect(result).toEqual(singleTicketResponse);
      expect(result.total).toBe(1);
      expect(result.items).toHaveLength(1);
    });

    it('should create order with multiple tickets for different sessions', async () => {
      const multiSessionOrder: CreateOrderDTO = {
        email: 'test@example.com',
        phone: '+7 (123) 456-78-90',
        tickets: [
          mockTickets[0],
          {
            film: 'film-2',
            session: 'session-2',
            daytime: '2024-01-01T14:00:00Z',
            row: 2,
            seat: 3,
            price: 250,
          },
        ],
      };

      const multiSessionResponse = {
        total: 2,
        items: multiSessionOrder.tickets.map((ticket) => ({
          ...ticket,
          id: expect.any(String),
        })),
      };

      mockOrderService.createOrder.mockResolvedValue(multiSessionResponse);

      const result = await controller.createOrder(multiSessionOrder);

      expect(service.createOrder).toHaveBeenCalledWith(multiSessionOrder);
      expect(result.total).toBe(2);
    });

    it('should handle order with empty tickets array', async () => {
      const emptyOrder: CreateOrderDTO = {
        email: 'test@example.com',
        phone: '+7 (123) 456-78-90',
        tickets: [],
      };

      const emptyResponse = {
        total: 0,
        items: [],
      };

      mockOrderService.createOrder.mockResolvedValue(emptyResponse);

      const result = await controller.createOrder(emptyOrder);

      expect(service.createOrder).toHaveBeenCalledWith(emptyOrder);
      expect(result).toEqual(emptyResponse);
    });

    it('should handle different email formats', async () => {
      const ordersWithEmails = [
        { ...mockOrderDTO, email: 'user.name+tag@example.com' },
        { ...mockOrderDTO, email: 'user_name@example.co.uk' },
        { ...mockOrderDTO, email: 'test@test-domain.com' },
      ];

      mockOrderService.createOrder.mockResolvedValue(mockOrderResponse);

      for (const order of ordersWithEmails) {
        const result = await controller.createOrder(order);
        expect(service.createOrder).toHaveBeenCalledWith(order);
        expect(result).toEqual(mockOrderResponse);
      }
    });

    it('should handle different phone formats', async () => {
      const ordersWithPhones = [
        { ...mockOrderDTO, phone: '+7 (123) 456-78-90' },
        { ...mockOrderDTO, phone: '8 (123) 456-78-90' },
        { ...mockOrderDTO, phone: '1234567890' },
      ];

      mockOrderService.createOrder.mockResolvedValue(mockOrderResponse);

      for (const order of ordersWithPhones) {
        const result = await controller.createOrder(order);
        expect(service.createOrder).toHaveBeenCalledWith(order);
        expect(result).toEqual(mockOrderResponse);
      }
    });
  });
});
