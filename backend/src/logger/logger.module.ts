import { Module } from '@nestjs/common';
import { AppConfig } from '../app.config.provider';
import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';

export const APP_LOGGER = 'APP_LOGGER';
export type LoggerType = 'tskv' | 'json' | 'dev';

@Module({
  providers: [
    DevLogger,
    JsonLogger,
    TskvLogger,
    {
      provide: APP_LOGGER,
      useFactory: (
        config: AppConfig,
        devLogger: DevLogger,
        jsonLogger: JsonLogger,
        tskvLogger: TskvLogger,
      ) => {
        switch (config.logger.type) {
          case 'dev':
            return devLogger;
          case 'json':
            return jsonLogger;
          case 'tskv':
          default:
            return tskvLogger;
        }
      },
      inject: ['CONFIG', DevLogger, JsonLogger, TskvLogger],
    },
  ],
  exports: [APP_LOGGER],
})
export class LoggerModule {}
