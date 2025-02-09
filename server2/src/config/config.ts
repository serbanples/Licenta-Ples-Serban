import { ConfigTypes } from "./configTypes";

/** configuration object for constants */
export const config: ConfigTypes = {
  express: {
    PORT: 3000,
  },
  amqp: {
    url: 'amqp://localhost:5672'
  },
  mongo: 'mongodb://localhost:27017/licenta',
  mongoQueryLimit: 500,
  jwt_secret: 'cheie_secreta_nebuna',
  smtp: {
    host: 'localhost',
    port: 1025
  }
}