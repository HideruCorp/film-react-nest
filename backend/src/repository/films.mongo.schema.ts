import mongoose, { Schema } from 'mongoose';

const ScheduleSchema = new Schema({
  id: { type: String, required: true },
  daytime: { type: String, required: true },
  hall: { type: String },
  rows: { type: Number, required: true },
  seats: { type: Number, required: true },
  price: { type: Number, required: true },
  taken: { type: [String], default: [] },
});

const FilmSchema = new mongoose.Schema({
  id: { type: String, required: true },
  rating: { type: Number },
  director: { type: String },
  tags: { type: [String] },
  title: { type: String, required: true },
  about: { type: String },
  description: { type: String },
  image: { type: String },
  cover: { type: String },
  schedule: { type: [ScheduleSchema], default: [] },
});

export const FilmModel = mongoose.model('Film', FilmSchema);
