import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Schedule } from './schedule.postgres.entity';

@Entity('film')
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', nullable: true })
  rating: number;

  @Column({ type: 'varchar', nullable: true })
  director: string;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'varchar', nullable: true })
  cover: string;

  // Не загружаем eager — findAll не должен тянуть расписание
  @OneToMany(() => Schedule, (schedule) => schedule.film)
  schedule: Schedule[];
}
