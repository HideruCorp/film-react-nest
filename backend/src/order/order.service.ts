import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { IFilmsRepository } from '../repository/films.repository.interface';
import {
  CreateOrderDTO,
  CreateOrderResponseDTO,
  OrderResponseItemDTO,
} from './dto/order.dto';
import * as crypto from 'node:crypto';
import { FILMS_REPOSITORY } from '../repository/films.repository.interface';

@Injectable()
export class OrderService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: IFilmsRepository,
  ) {}

  async createOrder(dto: CreateOrderDTO): Promise<CreateOrderResponseDTO> {
    try {
      await this.filmsRepository.bookTickets(dto.tickets);
    } catch (err) {
      throw new BadRequestException(err.message);
    }

    const items: OrderResponseItemDTO[] = dto.tickets.map((ticket) => ({
      ...ticket,
      id: crypto.randomUUID(),
    }));

    return { total: items.length, items };
  }
}
