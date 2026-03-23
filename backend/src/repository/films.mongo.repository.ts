import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Film, FilmDocument } from './films.mongo.schema';
import { IFilmsRepository } from './films.repository.interface';
import { GetFilmDTO, GetScheduleDTO } from '../films/dto/films.dto';
import { TicketDTO } from '../order/dto/order.dto';

@Injectable()
export class FilmsMongoRepository implements IFilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll(
    limit?: number,
    offset?: number,
  ): Promise<{ total: number; items: GetFilmDTO[] }> {
    const query = this.filmModel.find({});
    if (offset) query.skip(offset);
    if (limit) query.limit(limit);
    const [films, total] = await Promise.all([
      query,
      this.filmModel.countDocuments({}),
    ]);
    const items = films.map((film) => ({
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
    return { total, items };
  }

  async findSchedule(filmId: string): Promise<GetScheduleDTO[]> {
    const film = await this.filmModel.findOne({ id: filmId });
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
    const seatKeys = tickets.map((t) => `${t.row}:${t.seat}`);
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    for (const key of seatKeys) {
      if (seen.has(key)) duplicates.add(key);
      else seen.add(key);
    }
    if (duplicates.size > 0) {
      throw new Error(
        `Места ${[...duplicates].join(', ')} дублируются в заказе`,
      );
    }

    await Promise.all(
      tickets.map(async (ticket) => {
        const seatKey = `${ticket.row}:${ticket.seat}`;

        const result = await this.filmModel.findOneAndUpdate(
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
          const film = await this.filmModel.findOne({ id: ticket.film });
          if (!film) {
            throw new Error(`Фильм ${ticket.film} не найден`);
          }
          const session = film.schedule.find((s) => s.id === ticket.session);
          if (!session) {
            throw new Error(`Сеанс ${ticket.session} не найден`);
          }
          throw new Error(`Место ${seatKey} уже занято`);
        }
      }),
    );
  }
}
