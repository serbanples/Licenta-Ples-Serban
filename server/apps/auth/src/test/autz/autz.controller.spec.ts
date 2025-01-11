jest.mock('../rules/authorization.json', () => 
  require('./rules.mocks')
);

import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '@app/logger';
import { AutzController } from '../../autz-lib/controller/autz.controller';
import { AutzService } from '../../autz-lib/service/autz.service';
import {  
    mockLoggerService, 
    mockAutzService,
    mockAutzPayloads 
} from './autz.mocks';

describe('AutzController', () => {
    let controller: AutzController;
    let service: jest.Mocked<AutzService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AutzController],
            providers: [
                {
                    provide: AutzService,
                    useValue: mockAutzService
                },
                {
                    provide: LoggerService,
                    useValue: mockLoggerService
                }
            ]
        }).compile();

        controller = module.get<AutzController>(AutzController);
        service = module.get(AutzService);
    });

    describe('authorize', () => {
        it('should return true for authorized action', () => {
            const { validAdminPayload } = mockAutzPayloads;
            
            service.isAuthorized.mockReturnValue(true);

            const result = controller.authorize(validAdminPayload);

            expect(result).toBe(true);
            expect(service.isAuthorized).toHaveBeenCalledWith(
                validAdminPayload.usercontext.role,
                validAdminPayload.resource,
                validAdminPayload.action
            );
        });

        // ... more tests
    });
});