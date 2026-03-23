import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Film } from './film.postgres.entity';

@Entity('schedule')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // film_id FK — snake_case без кавычек
  @ManyToOne(() => Film, (film) => film.schedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'film_id' })
  film: Film;

  @Column({ type: 'varchar' })
  daytime: string;

  // Хранится как integer (0/1/2); в DTO маппится в string
  @Column({ type: 'integer' })
  hall: number;

  @Column({ type: 'integer' })
  rows: number;

  @Column({ type: 'integer' })
  seats: number;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'text', array: true, default: [] })
  taken: string[];
}
