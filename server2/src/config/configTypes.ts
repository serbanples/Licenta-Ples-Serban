export interface ConfigTypes {
  readonly express: {
    readonly PORT: number;
  };
  readonly amqp: {
    readonly url: string;
  }
}