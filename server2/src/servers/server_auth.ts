// import cookieParser from "cookie-parser";
// import express, { Application } from "express";
// import * as cors from 'cors';
// import { Factory } from "./factory";
// import { config } from "./config/config";
// import * as Bluebird from 'bluebird';
// import path from 'path';

import { Factory } from "../factories/factory";
import { AuthServer } from "../rpc/servers/AuthServer";
import { IServer } from "./server_iface";

/**
 * Server class used for starting the auth server.
 */
export class Server implements IServer {
    private authServer: AuthServer = new AuthServer();
    private factory: Factory = Factory.getInstance();

    constructor() {
        this.start();
    }

    /**
     * Method used to start the auth server
     * 
     * @returns {void} starts the server
     */
    public start(): void {
        this.authServer.start('auth_queue');
    }
}