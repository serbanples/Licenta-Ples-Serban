import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { AccountType } from "../schema/account.schema";
import { LoggerService } from "@app/logger";
import { Injectable } from "@nestjs/common";
import * as _ from "lodash";
import { AbstractModel } from "./abstract.model";
import { PopulateOpts } from "@app/shared";

/**
 * Class used to access mongo db logic for accounts.
 */
@Injectable()
export class AccountModel extends AbstractModel<AccountType>{
    private readonly logger: LoggerService;
    protected override textSearchFields: string[] = [];
    protected override populateOptions: PopulateOpts = [];

    /**
     * Constructor method.
     * 
     * @param {mongoose.Model<AccountType>} model account model type to use.
     * @param {LoggerService} logger logger used to log errors.
     */
    constructor(@InjectModel(AccountType.name) model: mongoose.Model<AccountType>, logger: LoggerService) {
        super(model, logger);
        this.logger = logger;
    }

    /**
     * Method used to find an account.
     * 
     * @param {object} filter mongo db query filter.
     * @returns {Promise<AccountType | null>} query result.
     */
    async findOneWithPassword(filter: object): Promise<AccountType | null>{
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
}