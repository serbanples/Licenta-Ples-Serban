import { Model, Document, QueryOptions, MongooseUpdateQueryOptions, UpdateWriteOpResult, DeleteResult } from 'mongoose';
import * as _ from 'lodash';
import { QueryPaginationFilter, ResourceWithPagination, PopulateOpts } from '@app/shared';
import { UtilsService } from '../utils/utils.service';
import { LoggerService } from '@app/logger';

export abstract class AbstractModel<ModelType extends Document> {
  protected abstract populateOptions: PopulateOpts;
  protected abstract textSearchFields: string[];
  protected readonly Model: Model<ModelType>;
  private loggerService: LoggerService;

  constructor(model: Model<ModelType>, logger: LoggerService) {
    this.Model = model;
    this.loggerService = logger;
  }

  getModel(): Model<ModelType> {
    return this.Model;
  }

   /**
     * Method used to find one document.
     * 
     * @param {object} filter mongoDb query.
     * @param {object} projection Fields to return (optional, default all).
     * @param {boolean} populate Flag to mark if returned docs will be populated (optional, default false).
     * @returns {Promise<ModelType | null>} query response.
     */
   async findOne(filter: object, projection: object = {}, populate: boolean = false): Promise<ModelType | null> {
    if(!this.Model) throw new Error('Setup method was not called!');

    return this.Model.findOne(filter, projection).exec()
        .then(async response => response ? UtilsService.toBoolean(populate) ? this.Model.populate(response, this.populateOptions) : response : null)
        .then(response => response ? response.toObject() as ModelType : null)
        .catch(error => { this.loggerService.error(error); throw error; });
}

/**
 * Method used to find multiple documents using filtering.
 * 
 * @param {object} filter mongoDb query.
 * @param {object} projection Fields to return (optional, default all).
 * @param {boolean} populate Flag to mark if returned docs will be populated (optional, default false).
 * @returns {Promise<ModelType[]>} query response.
 */
async findMany(filter: object, projection: object = {}, populate: boolean = false): Promise<ModelType[]> {
    if(!this.Model) throw new Error('Setup method was not called!');

    return this.Model.find(filter, projection).limit(UtilsService.getQueryLimit()).exec()
        .then(response => response ? UtilsService.toBoolean(populate) ? this.Model.populate(response, this.populateOptions) : response : [])
        .then(response => response ? _.map(response, (res) => res.toObject() as ModelType) : [])
        .catch(error => { this.loggerService.error(error); throw error; })
}

/**
 * Method used to count documents matching a certain filter
 * 
 * @param {object} filter mongoDb query. 
 * @returns {Promise<number>} number of documents.
 */
async count(filter: object): Promise<number> {
    if(!this.Model) throw new Error('Setup method was not called!');

    return this.Model.countDocuments(filter).exec()
        .catch(error => { this.loggerService.error(error); throw error; })
}

/**
 * Method used to get paginated documents.
 * 
 * @param {QueryPaginationFilter} pagination Pagination filter.
 * @param {object} query mongo db query.
 * @param {boolean} populate Flag to mark if returned docs will be populated (optional, default false).
 * @param {object} projection Fields to return (optional, default all).
 * @returns 
 */
async findWithPagination(pagination: QueryPaginationFilter, query: object = {}, populate: boolean = false, projection: object = {}): Promise<ResourceWithPagination<ModelType>> {
    if(!this.Model) throw new Error('Setup method was not called!');

    const text = _.get(query, 'text', '');
    const { fromItem, pageSize, orderBy, orderDir } = UtilsService.validatePaginationFilter(pagination);
    const mongoQuery = UtilsService.addTextQuery(text, this.textSearchFields, UtilsService.cleanMongoQuery(query));
    console.log(mongoQuery);
    return Promise.all([
        this.Model.countDocuments(mongoQuery).exec(),
        this.Model.find(mongoQuery, projection).skip(fromItem).limit(pageSize).sort( { [orderBy]: orderDir === 'asc' ? 1 : -1 } ),
    ])
        .then(async ([count, result]) => { return UtilsService.toBoolean(populate) ? Promise.all([count, this.Model.populate(result, this.populateOptions)]) : Promise.all([count, result]); })
        .then(([count, response]) => {
            const totalPages = _.ceil(count / pageSize);
            return {
                result: response ?  _.map(response, r => r.toObject() as ModelType) : [],
                pagination: {
                    fromItem: fromItem,
                    perPage: pageSize,
                    totalPages: totalPages,
                    count: _.size(response),
                    totalCount: count
                }
            }
        })
        .catch(error => { this.loggerService.error(error); throw error; })
}

async create(object: object): Promise<ModelType> {
    if(!this.Model) throw new Error('Setup method was not called!');

    console.log(object);
    return this.Model.create(object)
        .then(response => response.toObject() as ModelType)
        .catch(error => { this.loggerService.error(error); throw error; })
}

/**
 * Generic method used to update a document.
 * By default it will return the updated document.
 *
 * @param {object} filter MongoDB query like.
 * @param {object} updateObject MongoDB update object like.
 * @param {mongoose.QueryOptions} options Mongoose updateOne options.
 * @param {boolean} populate Flag to mark if returned docs will be populated.
 * @returns {ModelType} updated object
 */
async updateOne(filter: object, updateObject: object, options: QueryOptions = {}, populate: boolean = false): Promise<ModelType | null> {
    if (!this.Model) throw new Error('Setup method was not called!');

    if (!_.has(options, 'new')) options.new = true;
    return this.Model.findOneAndUpdate(filter, updateObject, options).exec()
        .then(async response => response ? UtilsService.toBoolean(populate) ? this.Model.populate(response, this.populateOptions) : response : null)
        .then(response => response ? response.toObject() as ModelType : null)
        .catch(error => { this.loggerService.error(error); throw error; });
}

/**
 * Generic method used to partial update a document.
 * By default it will return the updated document.
 *
 * @param {object} filter MongoDB query like.
 * @param {RecursivePartial<ModelType>} updateObject partial object.
 * @param {mongoose.QueryOptions} options Mongoose updateOne options
 * @param {boolean} populate Flag to mark if returned docs will be populated.
 * @returns {ModelType} updated object
 */
async updateOnePartial(filter: object, updateObject: Partial<ModelType>, options: QueryOptions = {}, populate: boolean = false): Promise<ModelType | null> {
    if (!this.Model) throw new Error('Setup method was not called!');

    if (!_.has(options, 'new')) options.new = true;
    return this.Model.findOneAndUpdate(filter, { $set: updateObject }, options).exec()
        .then(async response => response ? UtilsService.toBoolean(populate) ? this.Model.populate(response, this.populateOptions) : response : null)
        .then(response => response ? response.toObject() as ModelType : null)
        .catch(error => { this.loggerService.error(error); throw error; });
}

/**
 * Generic method used to update multiple documents.
 *
 * @param {object} filter MongoDB query like.
 * @param {object} updateObject MongoDB update object like.
 * @param {mongoose.QueryOptions} options Mongoose updateOne options
 * @returns {mongoose.UpdateWriteOpResult} Mongoose update result.
 */
async updateMany(filter: object, updateObject: object, options: MongooseUpdateQueryOptions = {}): Promise<UpdateWriteOpResult> {
    if (!this.Model) throw new Error('Setup method was not called!');

    return this.Model.updateMany(filter, updateObject, options).exec()
        .then(response => response)
        .catch(error => { this.loggerService.error(error); throw error; });
}

/**
 * Generic method used to delete a document.
 *
 * @param {object} filter MongoDB query like.
 * @returns {ModelType} updated object
 */
async deleteOne(filter: object): Promise<DeleteResult> {
    if (!this.Model) throw new Error('Setup method was not called!');

    return this.Model.deleteOne(filter).exec()
            .then(response => response)
            .catch(error => { this.loggerService.error(error); throw error; });
    }

/**
 * Generic method used to delete multiple documents.
 *
 * @param {object} filter MongoDB query like.
 * @param {boolean} force Flag to force a delete all query.
 * @returns {ModelType} updated object
 */
async deleteMany(filter: object, force: boolean = false): Promise<DeleteResult> {
    if (!this.Model) throw new Error('Setup method was not called!');
    if (_.isEmpty(filter) && !force) throw new Error('Delete all is not allowed without force flag.');

    return this.Model.deleteMany(filter).exec()
        .then(response => response)
        .catch(error => { this.loggerService.error(error); throw error; });
    }
}