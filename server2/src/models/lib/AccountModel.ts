import mongoose from "mongoose";
import { AbstractModel } from "./AbstractModel";
import { ModelNameEnum, PopulateOpts } from "../utils/types";
import { transformFn } from "../utils/utils";
import { logger } from "../../config/logger";
import { AccountModelType, UserRoleEnum } from "../utils/resource.types";

export class AccountModel extends AbstractModel<AccountModelType> {
    protected SchemaDef: mongoose.SchemaDefinition = {
        username: { type: String, required: true, unique: false },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        createdAt: { type: Date },
        updatedAt: { type: Date },
        role: { type: String, default: UserRoleEnum.USER }
    };

    protected SchemaOptions: mongoose.SchemaOptions = {
        collection: 'users',
        toObject: { getters: true, transform: transformFn },
        toJSON: { getters: true, transform: transformFn },
    }

    protected textSearchFields: string[] = ['email', 'name'];

    protected populateOptions: PopulateOpts = [];

    constructor(Mongoose: mongoose.Mongoose) {
        super(Mongoose, ModelNameEnum.ACCOUNT);
        this.setup();
    }

    protected addSchemaEnhancement(): void {
        this.Schema.index({ name: 1 });
        this.Schema.index({ email: 1 });
        this.Schema.pre('save', function(next){
          const now = new Date();
          this.updatedAt = now;
          if ( !this.created_at ) {
            this.createdAt = now;
          }
          next();
        });
    }

    /**
     * Custom find One method in order to return password.
     * 
     * @param {object} filter mongo db query
     * @returns {Promise<AccountModelType | null>} returned user.
     */
    public async findOneWithPassword(filter: object): Promise<AccountModelType | null> {
        return this.Model.findOne(filter).select('+password').exec()
            .then(async response => response ? response : null)
            .then(response => response ? response.toObject() as AccountModelType : null)
            .catch(error => { logger.error(error); throw error; });
    }
}