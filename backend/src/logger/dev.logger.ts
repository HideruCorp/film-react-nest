import { ConsoleLogger, Injectable } from '@nestjs/common';

/**
 * Логгер для локальной разработки.
 * встроенный ConsoleLogger уже реализует LoggerService.
 */
@Injectable()
export class DevLogger extends ConsoleLogger {}
