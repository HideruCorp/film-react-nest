import { GetFilmDTO, GetScheduleDTO } from '../films/dto/films.dto';
import { TicketDTO } from 'src/order/dto/order.dto';

export interface IFilmsRepository {
  findAll(limit?: number, offset?: number): Promise<{ total: number; items: GetFilmDTO[] }>;
  findSchedule(filmId: string): Promise<GetScheduleDTO[]>;
  bookTickets(tickets: TicketDTO[]): Promise<void>;
}
