import * as mongoose from 'mongoose';
import _ from "lodash";
import { config } from '../config';
import { ModelsInstance } from '../models/ModelsInstance';
import { LogicInstance } from '../logic/LogicInstance';
import { RpcClientsInstance } from '../rpcClients/rpcClientsInstance';

/** Factory class used to manage instance creation at application level */
export class Factory {
  private static _instance: Factory;
  private static logic: LogicInstance;
  private static models: ModelsInstance;
  private static mongoose: mongoose.Mongoose;
  private static rpcClients: RpcClientsInstance;

  private constructor() {
    if (Factory._instance) throw new Error('Use Factory.getInstance() instead of new Factory()');

    mongoose.set('strictQuery', false); // https://mongoosejs.com/docs/guide.html#strict
    mongoose.connect(config.mongo, {}).then(() => console.log('Connected to mongoDb'));
    (mongoose as any).Promise = Promise;
    Factory.rpcClients = new RpcClientsInstance();
    Factory.mongoose = mongoose;
    Factory.models = new ModelsInstance(Factory.mongoose);

    Factory.logic = new LogicInstance(Factory.models);
    Factory._instance = this;
  }

  /**
   * Method used to get a factory instance
   * 
   * @returns {Factory} factory instance
   */
  static getInstance(): Factory {
    if(_.isNil(Factory._instance)) Factory._instance = new Factory();
    return Factory._instance;
  }

  /**
   * Method used to get rpc clients
   * 
   * @returns {RpcClientsInstance} rpc clients
   */
  getRPCClients(): RpcClientsInstance {
    return Factory.rpcClients;
  }

  /**
   * Method used to get logic
   * 
   * @returns {LogicInstance} logic
   */
  getLogic(): LogicInstance {
    return Factory.logic;
  }

  /**
   * Method used to get models
   * 
   * @returns {ModelsInstance} models
   */
  getModels(): ModelsInstance { 
      return Factory.models; 
  }
}