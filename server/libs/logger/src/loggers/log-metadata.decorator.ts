import { CustomDecorator, SetMetadata } from '@nestjs/common';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const LOG_METADATA = 'log-metadata';
/**
 * Method used in order to decorate a method with additional logging metadata.
 * 
 * @param {Record<string, any>} metadata metadata.
 * @returns {CustomDecorator} decorator.
 */
export const LogMetadata = (metadata: Record<string, any>): CustomDecorator => SetMetadata(LOG_METADATA, metadata);