import { Client } from '@elastic/elasticsearch';
import { format } from 'winston';
import { ElasticsearchTransport, LogData } from 'winston-elasticsearch';

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

const logFormat = format.printf(({ level, message, timestamp, ...meta }) => {
  return JSON.stringify({
    '@timestamp': timestamp,
    level,
    message,
    ...meta,
  });
});

/**
 * Method used in order to instantiate a logger.
 * 
 * @param {string} serviceName name of the service using the logger.
 * @returns {ElasticsearchTransport} elastic search logger.
 */
export const createElasticLogger = (serviceName: string): ElasticsearchTransport => {
  const client = new Client({
    node: 'http://localhost:9200',
    maxRetries: 5,
    requestTimeout: 60000,
  });

  client
    .ping()
    .then(() => console.log('Successfully connected to Elasticsearch'))
    .catch((error) => console.error('Error connecting to Elasticsearch:', error));

  return new ElasticsearchTransport({
    level: 'info',
    client,
    index: 'logs-app',
    format: format.combine(format.timestamp(), logFormat),
    transformer: (logData: LogData) => {  
      return {
        '@timestamp': logData.timestamp ?? new Date().toISOString(),
        level: logData.level,
        message: logData.message,
        service: serviceName,
        ...logData.meta,
      };
    },
  });
};
