import * as mongoose from 'mongoose'
import { AccountModel } from './lib/AccountModel';

/** Class used to manage all Mongoose models. */
export class ModelsInstance {
    private mongoose: mongoose.Mongoose;
    public accountModel: AccountModel;

    constructor(mongoose: mongoose.Mongoose) {
        this.mongoose = mongoose;
        this.accountModel = new AccountModel(mongoose);
    }


}