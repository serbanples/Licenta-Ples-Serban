import { BucketItem } from "minio";

export interface FileMetadata {
  fileName: string;
  originalName: string;
  size: number;
  mimeType: string;
  bucket: string;
  fileType: string;
  fileUrl: string;
}

export interface StorageProvider {
  initializeBuckets(buckets: { name: string; purpose: string }[]): Promise<void>;
  uploadFile(file: Buffer, fileName: string, contentType: string, bucket: string): Promise<string>;
  getFileUrl(fileName: string, bucket: string, expirySeconds?: number): Promise<string>;
  deleteFile(fileName: string, bucket: string): Promise<boolean>;
  listFiles(bucket: string, prefix?: string): Promise<BucketItem[]>;
  bucketExists(bucket: string): Promise<boolean>;
  createBucket(bucket: string, region?: string): Promise<void>;
}