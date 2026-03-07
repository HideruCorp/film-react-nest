import { Injectable } from '@nestjs/common';
import { GetFilmDTO, GetScheduleDTO } from '../films/dto/films.dto';
import { TicketDTO } from '../order/dto/order.dto';
import { IFilmsRepository } from './films.repository.interface';

import * as filmsStub from '../../test/mongodb_initial_stub.json';

@Injectable()
export class FilmsMemoryRepository implements IFilmsRepository {
  private films = JSON.parse(JSON.stringify(filmsStub)) as typeof filmsStub;

  async findAll(): Promise<GetFilmDTO[]> {
    return this.films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    }));
  }

  async findSchedule(filmId: string): Promise<GetScheduleDTO[]> {
    const film = this.films.find((f) => f.id === filmId);
    if (!film) return [];

    return film.schedule.map((s) => ({
      id: s.id,
      daytime: s.daytime,
      hall: String(s.hall),
      rows: s.rows,
      seats: s.seats,
      price: s.price,
      taken: [...s.taken],
    }));
  }

  async bookTickets(tickets: TicketDTO[]): Promise<void> {
    for (const ticket of tickets) {
      const seatKey = `${ticket.row}:${ticket.seat}`;

      const film = this.films.find((f) => f.id === ticket.film);
      if (!film) throw new Error(`Фильм ${ticket.film} не найден`);

      const session = film.schedule.find((s) => s.id === ticket.session);
      if (!session) throw new Error(`Сеанс ${ticket.session} не найден`);

      if (session.taken.includes(seatKey)) {
        throw new Error(`Место ${seatKey} уже занято`);
      }

      session.taken.push(seatKey);
    }
  }
}
