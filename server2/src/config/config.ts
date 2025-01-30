import { ConfigTypes } from "./configTypes";

export const config: ConfigTypes = {
  express: {
    PORT: 3000,
  },
  amqp: {
    url: 'amqp://localhost:5672'
  }
}