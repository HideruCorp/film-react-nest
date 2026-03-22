import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  // GET /api/afisha/films/?limit=10&offset=0
  @Get()
  findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ) {
    return this.filmsService.findAll(limit, offset);
  }

  // GET /api/afisha/films/:id/schedule
  @Get(':id/schedule')
  findSchedule(@Param('id') id: string) {
    return this.filmsService.findSchedule(id);
  }
}
