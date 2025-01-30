import * as mq from 'amqplib';
import * as _ from 'lodash';
import { MessageHandler } from '../types';
import { config } from '../../../config';

export class RpcServerConf {
  private connection: mq.Connection | null = null;
  private channel: mq.Channel | null = null;
  private connected: boolean = false;
  private mq_uri: string = config.amqp.url; 

  async connect(): Promise<void> {
    return mq.connect(this.mq_uri)
      .then((conn) => {
        this.connection = conn;
        return this.connection.createChannel();
      }).then((channel) => {
        this.channel = channel;
        this.connected = true;
        console.log('connected')
      })
  }

  async listen(queue: string, handler: MessageHandler): Promise<void> {
    if (_.isNil(this.connected) || _.isNil(this.channel)) {
      throw new Error('Not connected to RabbitMQ');
    }

    await this.channel.assertQueue(queue, { durable: false });
    
    await this.channel.consume(queue, async (msg: mq.Message | null) => {
      if (_.isNil(msg) || _.isNil(this.channel)) return;
      try {
        const content = JSON.parse(msg.content.toString());
        const result = await handler(content);

        if (msg.properties.replyTo) {
          this.channel.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(JSON.stringify(result)),
            { correlationId: msg.properties.correlationId }
          );
        }
        this.channel.ack(msg);
      } catch (error) {
        if (msg.properties.replyTo) {
          this.channel.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(JSON.stringify({ error: (error as Error).message })),
            { correlationId: msg.properties.correlationId }
          );
        }
        this.channel.ack(msg);
      }
    });
  }

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