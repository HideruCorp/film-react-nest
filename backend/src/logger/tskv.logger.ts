import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private stringify(value: any): string {
    if (typeof value === 'string') {
      return value;
    }

    return JSON.stringify(value);
  }

  private escapeValue(value: string): string {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
  }

  private toTskvValue(value: any): string {
    return this.escapeValue(this.stringify(value));
  }

  formatMessage(level: string, message: any, ...optionalParams: any[]): string {
    let result = `level=${this.toTskvValue(level)}\tmessage=${this.toTskvValue(message)}`;

    if (optionalParams.length > 0) {
      result += `\toptionalParams=${this.toTskvValue(optionalParams)}`;
    }

    return `${result}\n`;
  }

  log(message: any, ...optionalParams: any[]): void {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]): void {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]): void {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  debug(message: any, ...optionalParams: any[]): void {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]): void {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}
