import * as _ from 'lodash';
import { RpcServerConf } from "../conf/RpcServerConf";
import { MessageType } from "../types";

/** Abstract server class used for managing rabbit mq connection and message handling */
export abstract class RpcServer {
  protected handlers: Map<string, Function>;
  protected rpcConf: RpcServerConf;

  constructor() {
    this.handlers = new Map();
    this.rpcConf = new RpcServerConf();
  }

  /**
   * Method used to bind concrete handler to a given method key.
   * 
   * @param {string} method name/key of the method.
   * @param {Function} handler concrete handler function.
   * @returns {void} binds the function to the key of the method.
   */
  protected registerHandler(method: string, handler: Function): void {
    this.handlers.set(method, handler);
  }

  /**
   * Method used to handle incoming messages.
   * 
   * @param {MessageType} message incoming message from other server.
   * @returns {Promise<any>} processed data.
   */
  protected async handleMessage(message: MessageType): Promise<any> {
    const { method, data } = message;
    const handler = this.handlers.get(method);

    if(_.isNil(handler)) {
      throw new Error(`Unkown method: ${method}`);
    }

    return await handler.call(this, ...data);
  }

  /**
   * Method used to start the server.
   * 
   * @param {string} queue queue name to listen to.
   * @returns {Promise<void>} starts the server.
   */
  async start(queue: string): Promise<void> {
    await this.rpcConf.connect();
    await this.rpcConf.listen(queue, this.handleMessage.bind(this));
  }

  /**
   * Method used to stop the server.
   * 
   * @returns {Promise<void>} stops the server.
   */
  async stop(): Promise<void> {
    await this.rpcConf.close();
  }
}