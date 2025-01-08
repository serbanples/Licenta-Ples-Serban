import { configTypes } from "./configTypes";

export const config: configTypes = {
    express: {
        port: 3000,
        url: 'http://localhost:3000'
    },
    rabbitMQ: {
        url: 'amqp://localhost:5672',
        auth: {
            serviceName: 'AUTH_SERVICE',
            queueName: 'auth_queue',
            messages: {
                login: 'auth_login',
                register: 'auth_register',
                whoami: 'auth_whoami'
            }
        },
        autz: {
            serviceName: 'AUTZ_SERVICE',
            queueName: 'autz_queue',
            messages: {
                authorize: 'autz_authorize',
            }
        }
    }
}