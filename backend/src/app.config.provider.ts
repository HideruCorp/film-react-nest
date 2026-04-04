import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerType } from './logger/logger.module';

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver: configService.get<string>('DATABASE_DRIVER', 'mongodb'),
      url: configService.get<string>(
        'DATABASE_URL',
        'mongodb://localhost:27017/prac',
      ),
      host: configService.get<string>('DATABASE_HOST', 'localhost'),
      port: configService.get<number>('DATABASE_PORT', 5432),
      username: configService.get<string>('DATABASE_USERNAME', 'postgres'),
      password: configService.get<string>('DATABASE_PASSWORD', ''),
      database: configService.get<string>('DATABASE_NAME', 'prac'),
    },
    logger: {
      type: configService.get<LoggerType>('LOGGER_TYPE', 'tskv'),
    },
  }),
  inject: [ConfigService],
};

export interface AppConfig {
  database: AppConfigDatabase;
  logger: AppConfigLogger;
}

export interface AppConfigDatabase {
  driver: string;
  // MongoDB
  url: string;
  // PostgreSQL
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface AppConfigLogger {
  type: LoggerType;
}
