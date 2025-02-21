import { Test, TestingModule } from '@nestjs/testing';
import { MinioController } from './minio.controller';
import { MinioService } from './minio.service';

describe('MinioController', () => {
  let minioController: MinioController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MinioController],
      providers: [MinioService],
    }).compile();

    minioController = app.get<MinioController>(MinioController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(minioController.getHello()).toBe('Hello World!');
    });
  });
});
