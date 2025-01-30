import * as _ from 'lodash';
import { RpcServerConf } from "../conf/RpcServerConf";
import { MessageType } from "../types";

export abstract class RpcServer {
  protected handlers: Map<string, Function>;
  protected rpcConf: RpcServerConf;

  constructor() {
    this.handlers = new Map();
    this.rpcConf = new RpcServerConf();
  }

  protected registerHandler(method: string, handler: Function): void {
    this.handlers.set(method, handler);
  }

  protected async handleMessage(message: MessageType): Promise<any> {
    const { method, data } = message;
    const handler = this.handlers.get(method);

    if(_.isNil(handler)) {
      throw new Error(`Unkown method: ${method}`);
    }

    return await handler.call(this, ...data);
  }

  async start(queue: string): Promise<void> {
    await this.rpcConf.connect();
    await this.rpcConf.listen(queue, this.handleMessage.bind(this));
  }

  async stop(): Promise<void> {
    await this.rpcConf.close();
  }
}