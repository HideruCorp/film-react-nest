import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';

export const databaseProvider = {
  provide: 'DATABASE_CONNECTION',
  useFactory: async (configService: ConfigService) => {
    const url = configService.get<string>(
      'DATABASE_URL',
      'mongodb://localhost:27017/prac',
    );
    return mongoose.connect(url);
  },
  inject: [ConfigService],
};
