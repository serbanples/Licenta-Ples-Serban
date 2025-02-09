import * as mq from 'amqplib';
import EventEmitter from 'events';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../../config';
import { MessageType } from '../types';
import { handleRpcError } from './errorHandler';

/** RPC CLIENT CONFIGURATION class used to manage connection to rabbit mq */
export class RpcClientConf {
  private connection: mq.Connection | null = null;
  private channel: mq.Channel | null = null;
  private responseQueue: string = '';
  private responseEmitter: EventEmitter = new EventEmitter();;
  private connected: boolean = false;
  private readonly mq_uri: string = config.amqp.url;

  constructor() {}

  /**
   * Method used to connect to a channel.
   * 
   * @returns {Promise<void>} connects to channel.
   */
  async connect(): Promise<void> {
    try {
      this.connection = await mq.connect(this.mq_uri);
      this.channel = await this.connection.createChannel();
      
      // Create response queue
      const q = await this.channel.assertQueue('', { exclusive: true });
      this.responseQueue = q.queue;

      // Setup response handling
      await this.channel.consume(
        this.responseQueue,
        (msg) => {
          if (msg) {
            const correlationId = msg.properties.correlationId;
            this.responseEmitter.emit(correlationId, {
              correlationId,
              data: JSON.parse(msg.content.toString())
            });
          }
        },
        { noAck: true }
      );

      this.connected = true;
    } catch (error) {
      throw new Error(`Failed to connect to RabbitMQ: ${error}`);
    }
  }

  /**
   * Method used to call a method on remote server.
   * 
   * @param {string} queue queue name to send message to
   * @param {MessageType} message message to send including method called and data.
   * @param {number} timeout timeout before ending the call (default 30 sec)
   * @returns {Promise<any>} response from server.
   */
  async call(queue: string, message: MessageType, timeout: number = 30000): Promise<any> {
    if (_.isNil(this.connected) || _.isNil(this.channel)) {
      throw new Error('Not connected to RabbitMQ');
    }

    const correlationId = uuidv4();

    return new Promise((resolve, reject) => {
      // Setup timeout
      const timeoutId = setTimeout(() => {
        this.responseEmitter.removeAllListeners(correlationId);
        reject(new Error('RPC call timeout'));
      }, timeout);

      // Setup response listener
      this.responseEmitter.once(correlationId, (response: { data: any }) => {
        console.log('data', response);
        clearTimeout(timeoutId);
        if (response.data.error) {
          reject(handleRpcError(response.data.error));
        } else {
          resolve(response.data);
        }
      });

      // Send message
      this.channel!.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        correlationId,
        replyTo: this.responseQueue
      });
    });
  }

  /**
   * Method used to emit a message to a method on remote server.
   * 
   * @param {string} queue queue name to send message to
   * @param {MessageType} message message to send including method called and data.
   * @returns {Promise<void>} emits a message
   */
  async emit(queue: string, message: MessageType): Promise<void> {
    if (_.isNil(this.connected) || _.isNil(this.channel)) {
        throw new Error('Not connected to RabbitMQ');
    }

    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }

  /**
   * Method used to close connection.
   * 
   * @returns {Promise<void>} closes rabbit mq connection.
   */
  async close(): Promise<void> {
    if (!_.isNil(this.channel)) {
      await this.channel.close();
    }
    if (!_.isNil(this.connection)) {
      await this.connection.close();
    }
    this.connected = false;
  }
}