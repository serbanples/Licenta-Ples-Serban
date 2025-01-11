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
                readonly login: string;
                readonly register: string;
                readonly whoami: string;
                readonly authorize: string;
            }
        };
    }
    readonly mongodb: {
        readonly auth_db_uri: string;
        readonly data_db_uri: string;
    }
}