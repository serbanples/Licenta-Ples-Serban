// import cookieParser from "cookie-parser";
// import express, { Application } from "express";
// import * as cors from 'cors';
// import { Factory } from "./factory";
// import { config } from "./config/config";
// import * as Bluebird from 'bluebird';
// import path from 'path';

import { AuthServer } from "../rpc/servers/AuthServer";

export class Server {
    // private app: Application = express();
    // private factory: Factory = Factory.getInstance();
    private authServer: AuthServer = new AuthServer();

    constructor() {
        this.init();
        this.start();
    }

    /**
     * Method used to initiate the express application
     * 
     * @returns {void} initiaites the express application
     */
    private init(): void {
        
    }

    /**
     * Method used to start the exress app
     * 
     * @returns {void} starts the server
     */
    public start(): void {
        this.authServer.start('auth_queue');
    }
}