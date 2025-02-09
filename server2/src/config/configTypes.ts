/** configuration type interface for configuration file */
export interface ConfigTypes {
  readonly express: {
    readonly PORT: number;
  };
  readonly amqp: {
    readonly url: string;
  };
  readonly mongo: string;
  readonly mongoQueryLimit: 500;
  readonly jwt_secret: string;
  readonly smtp: {
    readonly host: string;
    readonly port: number;
  }
}