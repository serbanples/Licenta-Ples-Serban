import { Test, TestingModule } from '@nestjs/testing';
import { DbaccController } from './dbacc.controller';
import { DbaccService } from './dbacc.service';

describe('DbaccController', () => {
  let dbaccController: DbaccController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DbaccController],
      providers: [DbaccService],
    }).compile();

    dbaccController = app.get<DbaccController>(DbaccController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(dbaccController.getHello()).toBe('Hello World!');
    });
  });
});
