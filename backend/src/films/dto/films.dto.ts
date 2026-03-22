export class GetScheduleDTO {
  id: string;
  daytime: string;
  hall: string;
  rows: number;
  seats: number;
  price: number;
  taken: string[]; // формат: "row:seat", например "2:5"
}

export class GetFilmDTO {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
}

export class GetFilmsResponseDTO {
  total: number;
  items: GetFilmDTO[];
}

export class GetScheduleResponseDTO {
  total: number;
  items: GetScheduleDTO[];
}
