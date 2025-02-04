import { RpcClientConf } from "../conf/RpcClientConf";

/**
 * Abstract client class used to send data from client to server via rabbitmq
 */
export abstract class RpcClient {
  protected rpcConf: RpcClientConf;
  protected queue: string;

  constructor(queue: string) {
    this.rpcConf = new RpcClientConf();
    this.queue = queue;
  }

  /**
   * Method used to make a RPC call to server and wait for a response.
   * 
   * @param {string} method name of the method invoked on the server.
   * @param {any[]} data arguments of the method invoked.
   * @returns {Promise<T>} response from the server.
   */
  protected async call<T>(method: string, data: any[]): Promise<T> {
    return this.rpcConf.call(this.queue, {
      method,
      data
    });
  }

  /**
   * Method used to make a emit a message to the server.
   * 
   * @param {string} method name of the method invoked on the server.
   * @param {any[]} data arguments of the method invoked.
   * @returns {Promise<void>} emits a message.
   */
  protected async emit(method: string, data: any[]): Promise<void> {
    await this.rpcConf.emit(this.queue, {
      method,
      data
    });
  }

  /**
   * Method used to connect to the rabbit mq channel.
   * 
   * @returns {Promise<void>} connects to channel.
   */
  async connect(): Promise<void> {
    await this.rpcConf.connect();
  }

  /**
   * Method used to close connection to the rabbit mq channel.
   * 
   * @returns {Promise<void>} closes connection to channel.
   */
  async close(): Promise<void> {
    await this.rpcConf.close();
  }
}