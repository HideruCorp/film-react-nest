import { Injectable } from '@nestjs/common';
import { GetFilmDTO, GetScheduleDTO } from '../films/dto/films.dto';
import { TicketDTO } from '../order/dto/order.dto';
import { IFilmsRepository } from './films.repository.interface';
import { FilmModel } from './films.mongo.schema';

@Injectable()
export class FilmsMongoRepository implements IFilmsRepository {
  async findAll(): Promise<GetFilmDTO[]> {
    const films = await FilmModel.find({});
    return films.map((film) => ({
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
    const film = await FilmModel.findOne({ id: filmId });
    if (!film) return [];
    return film.schedule.map((s) => ({
      id: s.id,
      daytime: s.daytime,
      hall: s.hall,
      rows: s.rows,
      seats: s.seats,
      price: s.price,
      taken: s.taken,
    }));
  }

  async bookTickets(tickets: TicketDTO[]): Promise<void> {
    for (const ticket of tickets) {
      const seatKey = `${ticket.row}:${ticket.seat}`;

      const result = await FilmModel.findOneAndUpdate(
        {
          id: ticket.film,
          'schedule.id': ticket.session,
          'schedule.taken': { $nin: [seatKey] },
        },
        {
          $addToSet: { 'schedule.$.taken': seatKey },
        },
        {
          new: false,
          projection: { _id: 1 },
        },
      );

      if (!result) {
        const film = await FilmModel.findOne({ id: ticket.film });
        if (!film) {
          throw new Error(`Фильм ${ticket.film} не найден`);
        }
        const session = film.schedule.find((s) => s.id === ticket.session);
        if (!session) {
          throw new Error(`Сеанс ${ticket.session} не найден`);
        }
        throw new Error(`Место ${seatKey} уже занято`);
      }
    }
  }
}
