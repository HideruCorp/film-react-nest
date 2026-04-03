import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';

export const APP_LOGGER = 'APP_LOGGER';
export type LoggerType = 'tskv' | 'json' | 'dev';

@Module({
  imports: [ConfigModule],
  providers: [
    DevLogger,
    JsonLogger,
    TskvLogger,
    {
      provide: APP_LOGGER,
      useFactory: (
        config: ConfigService,
        devLogger: DevLogger,
        jsonLogger: JsonLogger,
        tskvLogger: TskvLogger,
      ) => {
        switch (config.get<LoggerType>('LOGGER_TYPE', 'tskv')) {
          case 'dev':
            return devLogger;
          case 'json':
            return jsonLogger;
          case 'tskv':
          default:
            return tskvLogger;
        }
      },
      inject: [ConfigService, DevLogger, JsonLogger, TskvLogger],
    },
  ],
  exports: [APP_LOGGER],
})
export class LoggerModule {}
