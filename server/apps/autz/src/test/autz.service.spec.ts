import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '@app/logger';
import { AutzService } from '../autz.service';
import { UserRoleEnum } from '@app/shared_types';

jest.mock('../rules/authorization.json', () => ({
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
    let logger: jest.Mocked<LoggerService>;

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
        logger = module.get(LoggerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('isAuthorized', () => {
        it('should allow admin to create users', () => {
            const result = service.isAuthorized(UserRoleEnum.ADMIN, 'users', 'create');
            expect(result).toBe(true);
            expect(logger.info).toHaveBeenCalledWith(
                'Authorization check',
                expect.objectContaining({
                    event: 'authorization_check',
                    role: 'admin',
                    resource: 'users',
                    action: 'create',
                    result: 'allowed'
                })
            );
        });

        it('should deny regular user from creating users', () => {
            const result = service.isAuthorized(UserRoleEnum.USER, 'users', 'create');
            expect(result).toBe(false);
            expect(logger.info).toHaveBeenCalledWith(
                'Authorization check',
                expect.objectContaining({
                    event: 'authorization_check',
                    role: 'user',
                    resource: 'users',
                    action: 'create',
                    result: 'denied'
                })
            );
        });

        it('should handle non-existent role', () => {
            const result = service.isAuthorized('guest' as UserRoleEnum, 'users', 'read');
            expect(result).toBe(false);
            expect(logger.info).toHaveBeenCalledWith(
                'Authorization check',
                expect.objectContaining({
                    event: 'authorization_check',
                    role: 'guest',
                    resource: 'users',
                    action: 'read',
                    result: 'denied',
                    reason: 'Role not found'
                })
            );
        });

        it('should handle non-existent resource', () => {
            const result = service.isAuthorized(UserRoleEnum.ADMIN, 'settings', 'read');
            expect(result).toBe(false);
            expect(logger.info).toHaveBeenCalledWith(
                'Authorization check',
                expect.objectContaining({
                    event: 'authorization_check',
                    role: 'admin',
                    resource: 'settings',
                    action: 'read',
                    result: 'denied',
                    reason: 'Resource not found for role'
                })
            );
        });

        it('should handle non-existent action', () => {
            const result = service.isAuthorized(UserRoleEnum.ADMIN, 'users', 'archive');
            expect(result).toBe(false);
            expect(logger.info).toHaveBeenCalledWith(
                'Authorization check',
                expect.objectContaining({
                    event: 'authorization_check',
                    role: 'admin',
                    resource: 'users',
                    action: 'archive',
                    result: 'denied',
                    reason: 'Action not found for resource'
                })
            );
        });
    });
});