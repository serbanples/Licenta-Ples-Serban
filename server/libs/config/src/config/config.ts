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
                generateToken: 'auth_generate_token',
                createAccount: 'auth_create_account',
                validateToken: 'auth_validate_token',
                authorize: 'autz_authorize',
                verifyAccount: 'auth_verify_account',
            }
        },
        mailer: {
            serviceName: 'MAIL_SERVICE',
            queueName: 'mail_queue',
            messages: {
                verifyAccount: 'mailer_verify_account'
            }
        }
    },
    mongodb: {
        auth_db_uri: 'mongodb://localhost:27017/licenta_auth',
        data_db_uri: 'mongodb://localhost:27017/data_auth'
    },
    smtp: {
        host: 'localhost',
        port: 1025
    },
}