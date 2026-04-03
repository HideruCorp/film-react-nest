import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('returns a JSON string without additional parameters', () => {
      const result = logger.formatMessage('log', 'Service started');

      expect(result).toBe(
        JSON.stringify({
          level: 'log',
          message: 'Service started',
          optionalParams: [],
        }),
      );
    });

    it('returns a JSON string with additional parameters', () => {
      const result = logger.formatMessage(
        'error',
        'Booking error',
        'OrderService',
        { row: 2, seat: 5 },
      );

      expect(result).toBe(
        JSON.stringify({
          level: 'error',
          message: 'Booking error',
          optionalParams: ['OrderService', { row: 2, seat: 5 }],
        }),
      );
    });
  });

  describe('log', () => {
    it('passes correct JSON string to console.log', () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);

      logger.log('Application started', 'AppModule', 3000);

      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'log',
          message: 'Application started',
          optionalParams: ['AppModule', 3000],
        }),
      );
    });
  });

  describe('error', () => {
    it('passes correct JSON string to console.error', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      logger.error('Failed to connect to database', 'DatabaseModule');

      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'error',
          message: 'Failed to connect to database',
          optionalParams: ['DatabaseModule'],
        }),
      );
    });
  });

  describe('warn', () => {
    it('passes correct JSON string to console.warn', () => {
      const consoleSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      logger.warn('Almost no free seats left', 'OrderService');

      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'warn',
          message: 'Almost no free seats left',
          optionalParams: ['OrderService'],
        }),
      );
    });
  });

  describe('debug', () => {
    it('passes correct JSON string to console.debug', () => {
      const consoleSpy = jest
        .spyOn(console, 'debug')
        .mockImplementation(() => undefined);

      logger.debug('Request details', { limit: 10, offset: 0 });

      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'debug',
          message: 'Request details',
          optionalParams: [{ limit: 10, offset: 0 }],
        }),
      );
    });
  });

  describe('verbose', () => {
    it('passes correct JSON string to console.log for verbose level', () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);

      logger.verbose('Detailed diagnostics', 'FilmsController');

      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'verbose',
          message: 'Detailed diagnostics',
          optionalParams: ['FilmsController'],
        }),
      );
    });
  });
});
