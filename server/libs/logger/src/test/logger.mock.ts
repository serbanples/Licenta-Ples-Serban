export const mockRequest = {
    method: 'GET',
    originalUrl: '/api/test',
};

export const mockResponse = {
    on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'finish') {
            callback();
        }
    }),
    statusCode: 200,
};

export const mockNext = jest.fn();

export const mockCreateElasticLogger = {
    on: jest.fn(),
}

export const mockConnectionError = new Error('Connection failed');

export const mockError = new Error('Test error');

export const mockWinstonLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
}