import { createElasticLogger } from '../elastic-logger.factory';
import { Client } from '@elastic/elasticsearch';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { mockConnectionError } from './logger.mock';

jest.mock('@elastic/elasticsearch', () => ({
  Client: jest.fn().mockImplementation(() => ({
    ping: jest.fn().mockResolvedValue(true)
  }))
}));

jest.mock('winston-elasticsearch', () => ({
  ElasticsearchTransport: jest.fn().mockImplementation(() => ({}))
}));

describe('ElasticLoggerFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create elasticsearch transport', () => {
    const transport = createElasticLogger('TestService');

    expect(transport).toBeDefined();
    expect(ElasticsearchTransport).toHaveBeenCalled();
    expect(Client).toHaveBeenCalledWith({
      node: 'http://localhost:9200',
      maxRetries: 5,
      requestTimeout: 60000,
    });
  });

  it('should handle elasticsearch connection success', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const transport = createElasticLogger('TestService');

    await new Promise(process.nextTick);
    expect(consoleSpy).toHaveBeenCalledWith('Successfully connected to Elasticsearch');
  });

  it('should handle elasticsearch connection error', async () => {
    const consoleSpy = jest.spyOn(console, 'error');

    (Client as jest.Mock).mockImplementationOnce(() => ({
      ping: jest.fn().mockRejectedValue(mockConnectionError)
    }));

    createElasticLogger('TestService');

    await new Promise(process.nextTick);
    expect(consoleSpy).toHaveBeenCalledWith('Error connecting to Elasticsearch:', mockConnectionError);
  });

  it('should configure transport with correct options', () => {
    const transport = createElasticLogger('TestService');
    
    expect(transport).toBeDefined();
    expect(ElasticsearchTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'info',
        index: 'logs-app',
      })
    );
  });
}); 