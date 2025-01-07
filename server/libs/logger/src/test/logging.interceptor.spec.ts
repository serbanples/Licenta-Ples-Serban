import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { LoggerService } from '../loggers/logger.service';
import { LoggingInterceptor } from '../loggers/logging.interceptor';
import { of, throwError } from 'rxjs';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let loggerService: jest.Mocked<LoggerService>;
  let reflector: jest.Mocked<Reflector>;

  const mockExecutionContext = {
    switchToRpc: jest.fn().mockReturnValue({
      getData: jest.fn().mockReturnValue({}),
      getContext: jest.fn().mockReturnValue({
        getPattern: jest.fn(),
      }),
    }),
    getHandler: jest.fn(),
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggingInterceptor,
        {
          provide: LoggerService,
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    interceptor = module.get<LoggingInterceptor>(LoggingInterceptor);
    loggerService = module.get(LoggerService);
    reflector = module.get(Reflector);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should log received message', () => {
    const mockData = { email: 'test@test.com', password: 'secret' };
    const mockPattern = 'auth_register';
    const mockHandlerName = 'register';
    const mockMetadata = { action: 'user_register' };

    mockExecutionContext.switchToRpc().getData = jest.fn().mockReturnValue(mockData);
    mockExecutionContext.switchToRpc().getContext().getPattern.mockReturnValue(mockPattern);
    mockExecutionContext.getHandler = jest.fn().mockReturnValue({ name: mockHandlerName });
    reflector.get = jest.fn().mockReturnValue(mockMetadata);

    const mockCallHandler = {
      handle: () => of({ result: 'success' }),
    } as CallHandler;

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe();

    expect(loggerService.info).toHaveBeenCalledWith(
      'RabbitMQ Message Received',
      expect.objectContaining({
        event: 'rabbitmq_message_received',
        pattern: mockPattern,
        method: mockHandlerName,
        messageData: expect.objectContaining({
          email: 'test@test.com',
          password: '[REDACTED]',
        }),
      }),
    );
  });

  it('should log sent message', (done) => {
    const mockResponse = { status: 'success' };
    const mockPattern = 'auth_register';
    const mockHandlerName = 'register';
    const mockMetadata = { action: 'user_register' };

    mockExecutionContext.switchToRpc().getContext().getPattern.mockReturnValue(mockPattern);
    mockExecutionContext.getHandler = jest.fn().mockReturnValue({ name: mockHandlerName });
    reflector.get = jest.fn().mockReturnValue(mockMetadata);

    const mockCallHandler = {
      handle: () => of(mockResponse),
    } as CallHandler;

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      complete: () => {
        expect(loggerService.info).toHaveBeenCalledWith(
          'RabbitMQ Message Sent',
          expect.objectContaining({
            event: 'rabbitmq_message_sent',
            pattern: mockPattern,
            method: mockHandlerName,
            messageData: mockResponse,
          }),
        );
        done();
      },
    });
  });

  it('should log error message', (done) => {
    const mockError = new Error('Test error');
    const mockPattern = 'auth_register';
    const mockHandlerName = 'register';
    const mockMetadata = { action: 'user_register' };

    mockExecutionContext.switchToRpc().getContext().getPattern.mockReturnValue(mockPattern);
    mockExecutionContext.getHandler = jest.fn().mockReturnValue({ name: mockHandlerName });
    reflector.get = jest.fn().mockReturnValue(mockMetadata);

    const mockCallHandler = {
      handle: () => throwError(() => mockError),
    } as CallHandler;

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      error: () => {
        expect(loggerService.error).toHaveBeenCalledWith(
          'RabbitMQ Message Error',
          expect.objectContaining({
            event: 'rabbitmq_message_error',
            pattern: mockPattern,
            method: mockHandlerName,
            error: mockError.message,
          }),
        );
        done();
      },
    });
  });

  it('should sanitize sensitive data', () => {
    const mockData = {
      email: 'test@test.com',
      password: 'secret',
      token: 'jwt-token',
      secret: 'api-key',
    };

    const rpcContext = mockExecutionContext.switchToRpc();
    rpcContext.getData = jest.fn().mockReturnValue(mockData);

    const mockCallHandler = {
      handle: () => of({}),
    } as CallHandler;

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe();

    expect(loggerService.info).toHaveBeenCalledWith(
      'RabbitMQ Message Received',
      expect.objectContaining({
        messageData: {
          email: 'test@test.com',
          password: '[REDACTED]',
          token: '[REDACTED]',
          secret: '[REDACTED]',
        },
      }),
    );
  });
}); 