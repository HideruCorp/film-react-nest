import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('returns a TSKV string without additional parameters', () => {
      const result = logger.formatMessage('log', 'Сервис запущен');

      expect(result).toBe('level=log\tmessage=Сервис запущен\n');
    });

    it('returns a TSKV string with additional parameters', () => {
      const result = logger.formatMessage(
        'error',
        'Ошибка бронирования',
        'OrderService',
        { row: 2, seat: 5 },
      );

      expect(result).toBe(
        'level=error\tmessage=Ошибка бронирования\toptionalParams=["OrderService",{"row":2,"seat":5}]\n',
      );
    });

    it('escapes tabs and newlines inside message', () => {
      const result = logger.formatMessage(
        'warn',
        'Строка\tс табом\nи переносом',
      );

      expect(result).toBe(
        'level=warn\tmessage=Строка\\tс табом\\nи переносом\n',
      );
    });

    it('escapes special characters inside serialized optionalParams', () => {
      const result = logger.formatMessage('error', 'Ошибка', {
        context: 'OrderService',
        text: `line1\nline2\tvalue`,
      });

      expect(result).toBe(
        'level=error\tmessage=Ошибка\toptionalParams=[{"context":"OrderService","text":"line1\\\\nline2\\\\tvalue"}]\n',
      );
    });
  });

  describe('log', () => {
    it('passes correct TSKV string to console.log', () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);

      logger.log('Приложение запущено', 'AppModule');

      expect(consoleSpy).toHaveBeenCalledWith(
        'level=log\tmessage=Приложение запущено\toptionalParams=["AppModule"]\n',
      );
    });
  });

  describe('error', () => {
    it('passes correct TSKV string to console.error', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      logger.error('Не удалось подключиться к базе', 'DatabaseModule');

      expect(consoleSpy).toHaveBeenCalledWith(
        'level=error\tmessage=Не удалось подключиться к базе\toptionalParams=["DatabaseModule"]\n',
      );
    });
  });

  describe('warn', () => {
    it('passes correct TSKV string to console.warn', () => {
      const consoleSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      logger.warn('Свободных мест почти не осталось', 'OrderService');

      expect(consoleSpy).toHaveBeenCalledWith(
        'level=warn\tmessage=Свободных мест почти не осталось\toptionalParams=["OrderService"]\n',
      );
    });
  });

  describe('debug', () => {
    it('passes correct TSKV string to console.debug', () => {
      const consoleSpy = jest
        .spyOn(console, 'debug')
        .mockImplementation(() => undefined);

      logger.debug('Детали запроса', { limit: 10, offset: 0 });

      expect(consoleSpy).toHaveBeenCalledWith(
        'level=debug\tmessage=Детали запроса\toptionalParams=[{"limit":10,"offset":0}]\n',
      );
    });
  });

  describe('verbose', () => {
    it('passes correct TSKV string to console.log for verbose level', () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);

      logger.verbose('Подробная диагностика', 'FilmsController');

      expect(consoleSpy).toHaveBeenCalledWith(
        'level=verbose\tmessage=Подробная диагностика\toptionalParams=["FilmsController"]\n',
      );
    });
  });
});
