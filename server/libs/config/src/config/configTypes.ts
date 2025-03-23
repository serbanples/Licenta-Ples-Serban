export type configTypes = {
    readonly express: {
        readonly port: number;
        readonly url: string;
    }
    readonly rabbitMQ: {
        readonly url: string;
        readonly auth: {
            readonly serviceName: string;
            readonly queueName: string;
            readonly messages: {
                readonly generateToken: string;
                readonly createAccount: string;
                readonly validateToken: string;
                readonly authorize: string;
                readonly verifyAccount: string;
                readonly resetPassword: string;
                readonly requestResetPassword: string;
                readonly deleteAccount: string;
            }
        };
        readonly mailer: {
            readonly serviceName: string;
            readonly queueName: string;
            readonly messages: {
                readonly verifyAccount: string;
                readonly resetPassword: string;
            }
        }
        readonly core: {
            readonly serviceName: string;
            readonly queueName: string;
            readonly messages: {
                readonly usersBrowse: string;
                readonly usersCreate: string;
                readonly usersUpdate: string;
                readonly usersDelete: string;
            }
        }
        readonly minio: {
            readonly serviceName: string;
            readonly queueName: string;
            readonly messages: {
                
            }
        }
    }
    readonly mongodb: {
        readonly auth_db_uri: string;
        readonly data_db_uri: string;
        readonly query_limit: number;
    }
    readonly smtp: {
        readonly host: string;
        readonly port: number;
    },
    readonly minio: {
        readonly MINIO_ENDPOINT: string,
        readonly MINIO_PORT: number
        readonly MINIO_USE_SSL: boolean
        readonly MINIO_ACCESS_KEY: string,
        readonly MINIO_SECRET_KEY: string,
        readonly MINIO_BUCKET_NAME: string,
        readonly MINIO_REGION: string,
    },
    readonly tokenExpiration: number;
}