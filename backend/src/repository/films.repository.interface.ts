import { GetFilmDTO, GetScheduleDTO } from '../films/dto/films.dto';
import { TicketDTO } from 'src/order/dto/order.dto';

export interface IFilmsRepository {
  findAll(): Promise<GetFilmDTO[]>;
  findSchedule(filmId: string): Promise<GetScheduleDTO[]>;
  bookTickets(tickets: TicketDTO[]): Promise<void>;
}
