import { config } from '@app/config';
import { PaginationFilter, QueryPaginationFilter } from '@app/shared';
import _ from 'lodash';

// @ts-ignore

export class UtilsService {
  /**
   * Helper function used to turn a given value to a boolean
   * 
   * @param {any} value value to turn in a boolean
   * @returns {boolean} boolean
   */
  static toBoolean(value: any): boolean {
    //true
    if (value === true) return true;
    if (value === '1') return true;
    if (value === 1) return true;
    if (value === 'true') return true;

    // false
    if (value === false) return false;
    if (value === 'false') return false;
    if (value === -1) return false;
    if (value === '-1') return false;
    if (value === 0) return false;
    if (value === '0') return false;

    // default
    return false;
  }

  /**
   * Helper method used to return the maximum number of documents we can query.
   * 
   * @returns {number} Maximum number of documents we can retrieve.
   */
  static getQueryLimit(): number {
    return config.mongodb.query_limit;
  }

  /**
   * Helper method used to create the pagination filter for mongo query.
   * 
   * @param {QueryPaginationFilter} originalPagination pagination filter from request.
   * @returns {PaginationFilter} validated pagination.
   */
  static validatePaginationFilter(originalPagination: QueryPaginationFilter): PaginationFilter {
    const fromItem: number =
      originalPagination.fromItem ? originalPagination.fromItem : 0;
    const pageSize: number =
      originalPagination.pageSize && originalPagination.pageSize < 50 ? originalPagination.pageSize : 50;
    const orderBy: string = originalPagination.orderBy ?? 'id';
    const orderDir: 'asc' | 'desc' = originalPagination.orderDir ?? 'asc';

    return {
      fromItem: fromItem,
      pageSize: pageSize,
      orderBy: orderBy,
      orderDir: orderDir,
    }
  }

  /**
   * Method used to add free text search filter.
   * 
   * @param {string} textFilter text to search for
   * @param {string[]} searchFields fields to look for with free text.
   * @param {object} query original query.
   * @returns {object} query with free text search.
   */
  static addTextQuery(textFilter: string, searchFields: string[], query: Record<string, any>): object {
    const text = textFilter || '';
    query = _.omit(query, ['text']);
    if (!_.isNil(text) && !_.isEmpty(text) && !_.isEmpty(searchFields)) {
      const formattedText = this.quote(text);
      try {
        const regExp = new RegExp(formattedText, 'i');
        if (!query['$or'])
          query['$or'] = [];
        query['$or'] = _.concat(query['$or'], _.map(searchFields, (field) => {
          return _.zipObject([field], [regExp]);
        }));
      } catch (error) { }
    }

    return query;
  }

  /**
   * Method used to clean the mongo query before applying it.
   * 
   * @param {object} query original mongo query
   * @returns {object} clean query.
   */
  static cleanMongoQuery(query: object): object {
    return _.omit(query, ['text', 'pagination', 'populate']);
  }

  static quote(text: string): string {
    let output = text.replace(/\(/g, '\\(');
    output = output.replace(/\)/g, '\\)');

    // quote square brackets
    output = output.replace(/\[/g, '\\[');
    output = output.replace(/\]/g, '\\]');

    // quote braces
    output = output.replace(/\{/g, '\\{');
    output = output.replace(/\}/g, '\\}');

    // quote backslash
    output = output.replace(/\\/g, '\\');
    return output;
  }
}
