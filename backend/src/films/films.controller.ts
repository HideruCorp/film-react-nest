import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  // GET /api/afisha/films/
  @Get()
  findAll() {
    return this.filmsService.findAll();
  }

  // GET /api/afisha/films/:id/schedule
  @Get(':id/schedule')
  findSchedule(@Param('id') id: string) {
    return this.filmsService.findSchedule(id);
  }
}
