import { EventEmitter } from 'events';

import { Test, TestingModule } from '@nestjs/testing';
import { createLogger } from 'winston';

import { createElasticLogger } from '../loggers/elastic-logger.factory';
import { LoggerService } from '../loggers/logger.service';

import {
  mockCreateElasticLogger,
  mockError,
  mockWinstonLogger,
} from './logger.mock';

jest.mock('winston', () => ({
  createLogger: jest.fn(),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    json: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
  },
}));

jest.mock('../loggers/elastic-logger.factory', () => ({
  createElasticLogger: jest.fn(),
}));

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(async () => {
    (createLogger as jest.Mock).mockReturnValue(mockWinstonLogger);
    (createElasticLogger as jest.Mock).mockReturnValue(mockCreateElasticLogger);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LoggerService,
          useFactory: () => new LoggerService('TestService'),
        },
      ],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('info', () => {
    it('should call winston logger info method', () => {
      const message = 'test message';
      const meta = { test: 'data' };

      service.info(message, meta);

      expect(mockWinstonLogger.info).toHaveBeenCalledWith(message, { ...meta });
    });
  });

  describe('error', () => {
    it('should call winston logger error method', () => {
      const message = 'error message';
      const meta = { error: 'test error' };

      service.error(message, meta);

      expect(mockWinstonLogger.error).toHaveBeenCalledWith(message, {
        ...meta,
      });
    });
  });

  describe('warn', () => {
    it('should call winston logger warn method', () => {
      const message = 'warning message';
      const meta = { warning: 'test warning' };

      service.warn(message, meta);

      expect(mockWinstonLogger.warn).toHaveBeenCalledWith(message, { ...meta });
    });
  });

  describe('initialization', () => {
    it('should create logger with correct service name', () => {
      expect(createLogger).toHaveBeenCalled();
      expect(createElasticLogger).toHaveBeenCalledWith('TestService');
    });

    it('should handle elasticsearch transport errors', () => {
      const consoleSpy = jest.spyOn(console, 'error');
      const mockTransport = new EventEmitter();

      (createElasticLogger as jest.Mock).mockReturnValue(mockTransport);

      new LoggerService('TestService');

      process.nextTick(() => {
        mockTransport.emit('error', mockError);
      });

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(consoleSpy).toHaveBeenCalledWith(
            'Elasticsearch transport error:',
            mockError,
          );
          resolve();
        }, 0);
      });
    });
  });
});
