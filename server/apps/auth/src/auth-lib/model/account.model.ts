import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { AccountType } from "./account.schema";
import { LoggerService } from "@app/logger";
import { Injectable } from "@nestjs/common";

/**
 * Class used to access mongo db logic for accounts.
 */
@Injectable()
export class AccountModel {
    private readonly Model: mongoose.Model<AccountType>;
    private readonly logger: LoggerService;

    /**
     * Constructor method.
     * 
     * @param {mongoose.Model<AccountType>} model account model type to use.
     * @param {LoggerService} logger logger used to log errors.
     */
    constructor(@InjectModel(AccountType.name) model: mongoose.Model<AccountType>, logger: LoggerService) {
        this.Model = model;
        this.logger = logger;
    }

    /**
     * Getter method.
     * 
     * @returns {mongoose.Model<AccountType>} model.
     */
    getModel(): mongoose.Model<AccountType> {
        return this.Model;
    }

    /**
     * Method used to find an account.
     * 
     * @param {object} filter mongo db query filter.
     * @returns {Promise<AccountType | null>} query result.
     */
    async findOne(filter: object): Promise<AccountType | null>{
        return this.Model.findOne(filter).select('+password').exec()
            .then((user) => user ? user.toObject() : null)
            .catch(error => {
                this.logger.error('Error wile find one query', {
                    filter: filter,
                    error: (error as Error).message,
                    timestamp: new Date().toISOString(),
                });
                throw error;
            });
    }

    /**
     * Method used to create a new user.
     * 
     * @param {Partial<AccountType>} newObject new object to save to the database.
     * @returns {Promise<AccountType>} saved object.
     */
    async create(newObject: Partial<AccountType>): Promise<AccountType> {
        return this.Model.create(newObject)
        .then((user) => user.toObject())
        .catch(error => {
            this.logger.error('Error wile create query', {
                newValue: newObject,
                error: (error as Error).message,
                timestamp: new Date().toISOString(),
            });
            throw error;
        })
    }
}