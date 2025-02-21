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
        requestResetPassword: 'auth_request_password_reset',
        resetPassword: 'auth_reset_password',
        deleteAccount: 'auth_delete_account'
      }
    },
    mailer: {
      serviceName: 'MAIL_SERVICE',
      queueName: 'mail_queue',
      messages: {
        verifyAccount: 'mailer_verify_account',
        resetPassword: 'mailer_reset_password'
      }
    },
    core: {
      serviceName: 'CORE_SERVICE',
      queueName: 'core_queue',
      messages: {
        usersBrowse: "core_users_browse",
        usersCreate: "core_users_create",
        usersUpdate: "core_users_update",
        usersDelete: "core_users_delete",
      }
    }
  },
  mongodb: {
    auth_db_uri: 'mongodb://localhost:27017/licenta_auth',
    data_db_uri: 'mongodb://localhost:27017/data_auth',
    query_limit: 500
  },
  smtp: {
    host: 'localhost',
    port: 1025
  },
  tokenExpiration: 10 * 60 * 1000 //10 minutes, used for reset and verify token.
}