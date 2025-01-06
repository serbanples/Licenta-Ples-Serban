import { Client } from '@elastic/elasticsearch';
import { format } from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

const logFormat = format.printf(({ level, message, timestamp, ...meta }) => {
  return JSON.stringify({
    '@timestamp': timestamp,
    level,
    message,
    ...meta,
  });
});

/**
 *
 * @param serviceName
 */
export const createElasticLogger = (serviceName: string) => {
  const client = new Client({
    node: 'http://localhost:9200',
    maxRetries: 5,
    requestTimeout: 60000,
  });

  client
    .ping()
    .then(() => console.log('Successfully connected to Elasticsearch'))
    .catch((error) =>
      console.error('Error connecting to Elasticsearch:', error),
    );

  return new ElasticsearchTransport({
    level: 'info',
    client,
    index: 'logs-app',
    format: format.combine(format.timestamp(), logFormat),
    transformer: (logData) => {
      return {
        '@timestamp': logData.timestamp || new Date().toISOString(),
        level: logData.level,
        message: logData.message,
        service: serviceName,
        ...logData.meta,
      };
    },
  });
};
