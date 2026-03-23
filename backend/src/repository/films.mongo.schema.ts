import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
export class Schedule {
  @Prop({ required: true }) id: string;
  @Prop({ required: true }) daytime: string;
  @Prop() hall: string;
  @Prop({ required: true }) rows: number;
  @Prop({ required: true }) seats: number;
  @Prop({ required: true }) price: number;
  @Prop({ type: [String], default: [] }) taken: string[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);

@Schema()
export class Film {
  @Prop({ required: true }) id: string;
  @Prop() rating: number;
  @Prop() director: string;
  @Prop({ type: [String] }) tags: string[];
  @Prop({ required: true }) title: string;
  @Prop() about: string;
  @Prop() description: string;
  @Prop() image: string;
  @Prop() cover: string;
  @Prop({ type: [ScheduleSchema], default: [] }) schedule: Schedule[];
}

export type FilmDocument = HydratedDocument<Film>;
export const FilmSchema = SchemaFactory.createForClass(Film);
