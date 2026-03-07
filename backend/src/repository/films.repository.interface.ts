import { GetFilmDTO, GetScheduleDTO } from '../films/dto/films.dto';

export interface IFilmsRepository {
  findAll(): Promise<GetFilmDTO[]>;
  findSchedule(filmId: string): Promise<GetScheduleDTO[]>;
  // TODO: bookTickets(tickets: TicketDTO[]): Promise<void>;
}
