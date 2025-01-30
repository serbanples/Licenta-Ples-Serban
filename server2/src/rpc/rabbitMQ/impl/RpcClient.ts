import { RpcClientConf } from "../conf/RpcClientConf";

export abstract class RpcClient {
  protected rpcConf: RpcClientConf;
  protected queue: string;

  constructor(queue: string) {
      this.rpcConf = new RpcClientConf();
      this.queue = queue;
  }

  protected async call<T>(method: string, params: any[]): Promise<T> {
      return this.rpcConf.call(this.queue, {
          method,
          params
      });
  }

  protected async emit(method: string, params: any[]): Promise<void> {
      await this.rpcConf.emit(this.queue, {
          method,
          params
      });
  }

  async connect(): Promise<void> {
      await this.rpcConf.connect();
  }

  async close(): Promise<void> {
      await this.rpcConf.close();
  }
}