import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { StorageProvider } from '../../common/interface/storage-provider.interface';
import { config } from '@app/config';
import { LoggerService } from '@app/logger';
import _ from 'lodash';
import Bluebird from 'bluebird';

@Injectable()
export class MinioStorageService implements StorageProvider {
  private minioClient: Minio.Client;
  private readonly logger;

  constructor(loggerService: LoggerService) {
    this.minioClient = new Minio.Client({
      endPoint: config.minio.MINIO_ENDPOINT,
      port: config.minio.MINIO_PORT,
      useSSL: config.minio.MINIO_USE_SSL,
      accessKey: config.minio.MINIO_ACCESS_KEY,
      secretKey: config.minio.MINIO_SECRET_KEY,
    });
    this.logger = loggerService;
  }

  async initializeBuckets(buckets: { name: string; purpose: string }[]): Promise<void> {
    const region = config.minio.MINIO_REGION;
    
    // for (const bucket of buckets) {
    //   try {
    //     const exists = await this.bucketExists(bucket.name);
    //     if (!exists) {
    //       await this.createBucket(bucket.name, region);
          
    //     } else {
    //       this.logger.log(`${bucket.purpose} bucket '${bucket.name}' already exists`);
    //     }
    //   } catch (error) {
    //     this.logger.error(`Failed to initialize ${bucket.purpose} bucket: ${(error as Error).message}`);
    //     throw error;
    //   }
    // }
    Bluebird.each(buckets, async (bucket) => {
      this.bucketExists(bucket.name)
        .then((exists) => {
          if(!exists) {
            this.createBucket(bucket.name, region)
          }
        })
    })
  }

  async bucketExists(bucket: string): Promise<boolean> {
    return this.minioClient.bucketExists(bucket);
  }

  async createBucket(bucket: string, region?: string): Promise<void> {
    await this.minioClient.makeBucket(bucket, region || 'us-east-1');
  }

  async uploadFile(file: Buffer, fileName: string, contentType: string, bucket: string): Promise<string> {
    try {
      await this.minioClient.putObject(
        bucket,
        fileName,
        file,
        file.length,
        { 'Content-Type': contentType }
      );
      
      this.logger.log(`File '${fileName}' uploaded to ${bucket} successfully`);
      return fileName;
    } catch (error) {
      this.logger.error(`Failed to upload file '${fileName}' to ${bucket}: ${error.message}`);
      throw error;
    }
  }

  async getFileUrl(fileName: string, bucket: string, expirySeconds: number = 60 * 60 * 24 * 7): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(bucket, fileName, expirySeconds);
    } catch (error) {
      this.logger.error(`Failed to generate URL for file '${fileName}' in ${bucket}: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(fileName: string, bucket: string): Promise<boolean> {
    try {
      await this.minioClient.removeObject(bucket, fileName);
      this.logger.log(`File '${fileName}' deleted from ${bucket} successfully`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete file '${fileName}' from ${bucket}: ${error.message}`);
      throw error;
    }
  }

  async listFiles(bucket: string, prefix: string = ''): Promise<Minio.BucketItem[]> {
    try {
      const fileStream = this.minioClient.listObjects(bucket, prefix, true);
      const files: Minio.BucketItem[] = [];
      
      return new Promise((resolve, reject) => {
        fileStream.on('data', (file) => files.push(file));
        fileStream.on('error', reject);
        fileStream.on('end', () => resolve(files));
      });
    } catch (error) {
      this.logger.error(`Failed to list files in ${bucket}: ${error.message}`);
      throw error;
    }
  }
}