import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';

import { LoggerMiddleware } from '../logger.middleware';
import { LoggerService } from '../logger.service';

import { mockRequest, mockResponse, mockNext } from './logger.mock';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;
  let mockLoggerService: jest.Mocked<LoggerService>;
  let request: Partial<Request>;
  let response: Partial<Response>;
  let next: jest.Mock;

  beforeEach(async () => {
    mockLoggerService = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerMiddleware,
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    middleware = module.get<LoggerMiddleware>(LoggerMiddleware);

    request = mockRequest;
    response = mockResponse;
    next = mockNext;
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('use', () => {
    it('should log request information', () => {
      middleware.use(request as Request, response as Response, next);

      expect(mockLoggerService.info).toHaveBeenCalledWith('HTTP Request', {
        type: 'request',
        method: 'GET',
        url: '/api/test',
        timestamp: expect.any(String),
      });
    });

    it('should log response information', () => {
      middleware.use(request as Request, response as Response, next);

      expect(mockLoggerService.info).toHaveBeenCalledWith('HTTP Response', {
        type: 'response',
        method: 'GET',
        url: '/api/test',
        statusCode: 200,
        timestamp: expect.any(String),
      });
    });

    it('should call next()', () => {
      middleware.use(request as Request, response as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should handle different HTTP methods and status codes', () => {
      mockRequest.method = 'POST';
      response.statusCode = 201;

      middleware.use(request as Request, response as Response, next);

      expect(mockLoggerService.info).toHaveBeenCalledWith('HTTP Request', {
        type: 'request',
        method: 'POST',
        url: '/api/test',
        timestamp: expect.any(String),
      });

      expect(mockLoggerService.info).toHaveBeenCalledWith('HTTP Response', {
        type: 'response',
        method: 'POST',
        url: '/api/test',
        statusCode: 201,
        timestamp: expect.any(String),
      });
    });

    it('should handle errors in response event handler', () => {
      new Error('Test error');
      const mockLogger = {
        info: jest.fn(),
        error: jest.fn(),
      };

      mockResponse.on = jest.fn().mockImplementation((event, callback) => {
        if (event === 'finish') {
          try {
            callback();
          } catch (e) {
            mockLogger.error('Error in response handler:', e);
          }
        }
        return mockResponse;
      });

      middleware.use(request as Request, response as Response, next);

      expect(mockResponse.on).toHaveBeenCalledWith(
        'finish',
        expect.any(Function),
      );
      expect(next).toHaveBeenCalled();
    });
  });
});
