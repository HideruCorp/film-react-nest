import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { IFilmsRepository } from '../repository/films.repository.interface';
import {
  CreateOrderDTO,
  CreateOrderResponseDTO,
  OrderResponseItemDTO,
} from './dto/order.dto';
import { v4 as uuidv4 } from 'uuid';
import { FILMS_REPOSITORY } from '../repository/repository.module';

@Injectable()
export class OrderService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: IFilmsRepository
  ) {}

  async createOrder(dto: CreateOrderDTO): Promise<CreateOrderResponseDTO> {
    try {
      await this.filmsRepository.bookTickets(dto.tickets);
    } catch (err) {
      throw new BadRequestException(err.message);
    }

    const items: OrderResponseItemDTO[] = dto.tickets.map((ticket) => ({
      ...ticket,
      id: uuidv4(),
    }));

    return { total: items.length, items };
  }
}
