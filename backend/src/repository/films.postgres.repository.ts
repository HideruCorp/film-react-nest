import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Film } from './film.postgres.entity';
import { Schedule } from './schedule.postgres.entity';
import { IFilmsRepository } from './films.repository.interface';
import { GetFilmDTO, GetScheduleDTO } from '../films/dto/films.dto';
import { TicketDTO } from '../order/dto/order.dto';

@Injectable()
export class FilmsPostgresRepository implements IFilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepo: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepo: Repository<Schedule>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    limit?: number,
    offset?: number,
  ): Promise<{ total: number; items: GetFilmDTO[] }> {
    const [films, total] = await this.filmRepo.findAndCount({
      skip: offset,
      take: limit,
    });

    const items: GetFilmDTO[] = films.map((film) => ({
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
    // PostgreSQL бросает QueryFailedError на невалидный UUID — лучше не доводить до этого.
    const UUID_RE =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!UUID_RE.test(filmId)) return []; // FilmsService сам обработает пустой массив в 404.

    const schedules = await this.scheduleRepo.find({
      where: { film: { id: filmId } },
    });

    return schedules.map(
      (s): GetScheduleDTO => ({
        id: s.id,
        daytime: s.daytime,
        hall: String(s.hall),
        rows: s.rows,
        seats: s.seats,
        price: s.price,
        taken: s.taken,
      }),
    );
  }

  async bookTickets(tickets: TicketDTO[]): Promise<void> {
    // Проверяем дубли внутри одного запроса до обращения к БД
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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const ticket of tickets) {
        const seatKey = `${ticket.row}:${ticket.seat}`;

        // Атомарный UPDATE: добавляет место только если его ещё нет в taken.
        // queryRunner.query() в TypeORM 0.3 возвращает кортеж [rows[], rowCount],
        // поэтому rowCount читаем из result[1], а не из result.length.
        const [, rowCount]: [unknown[], number] = await queryRunner.query(
          `UPDATE schedule
           SET    taken = array_append(taken, $1)
           WHERE  id      = $2
             AND  film_id = $3
             AND  NOT ($1 = ANY(taken))`,
          [seatKey, ticket.session, ticket.film],
        );

        if (rowCount === 0) {
          // Выясняем точную причину провала
          const found: { film_id: string }[] = await queryRunner.query(
            `SELECT film_id FROM schedule WHERE id = $1`,
            [ticket.session],
          );

          if (found.length === 0) {
            throw new Error(`Сеанс ${ticket.session} не найден`);
          }
          if (found[0].film_id !== ticket.film) {
            throw new Error(`Сеанс ${ticket.session} не найден`);
          }
          // Сеанс и фильм совпали — значит место уже занято
          throw new Error(`Место ${seatKey} уже занято`);
        }
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
