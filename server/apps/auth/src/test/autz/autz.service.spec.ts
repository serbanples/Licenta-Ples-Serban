import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '@app/logger';
import { AutzService } from '../../autz-lib/autz.service';
import { UserRoleEnum } from '@app/shared';

jest.mock('../../autz-lib/rules/authorization.json', () => ({
    "user": {
        "users": {
            "create": false,
        }
    },
    "admin": {
        "users": {
            "create": true
        }
    }
}));

describe('AutzService', () => {
    let service: AutzService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AutzService,
                {
                    provide: LoggerService,
                    useValue: {
                        info: jest.fn(),
                        error: jest.fn(),
                        warn: jest.fn(),
                    }
                }
            ]
        }).compile();

        service = module.get<AutzService>(AutzService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('isAuthorized', () => {
        it('should allow admin to create users', () => {
            const result = service.isAuthorized(UserRoleEnum.ADMIN, 'users', 'create');
            expect(result).toBe(true);
        });

        it('should deny regular user from creating users', () => {
            const result = service.isAuthorized(UserRoleEnum.USER, 'users', 'create');
            expect(result).toBe(false);
        });

        it('should handle non-existent role', () => {
            const result = service.isAuthorized('guest' as UserRoleEnum, 'users', 'read');
            expect(result).toBe(false);
        });

        it('should handle non-existent resource', () => {
            const result = service.isAuthorized(UserRoleEnum.ADMIN, 'settings', 'read');
            expect(result).toBe(false);
        });

        it('should handle non-existent action', () => {
            const result = service.isAuthorized(UserRoleEnum.ADMIN, 'users', 'archive');
            expect(result).toBe(false);
        });
    });
});