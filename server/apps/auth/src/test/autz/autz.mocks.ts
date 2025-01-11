import { UserRoleEnum } from "@app/shared_types";

// Mock services
export const mockLoggerService = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
};

export const mockAutzService = {
    isAuthorized: jest.fn(),
};

// Mock payloads
export const mockAutzPayloads = {
    validAdminPayload: {
        usercontext: {
            id: '123',
            email: 'serban',
            role: UserRoleEnum.ADMIN
        },
        resource: 'users',
        action: 'create'
    },
    validUserPayload: {
        usercontext: {
            id: '123',
            email: 'serban',
            role: UserRoleEnum.USER
        },
        resource: 'users',
        action: 'read'
    },
    invalidPayload: {
        usercontext: {
            id: '123',
            email: 'serban',
            role: 'guest' as UserRoleEnum,
        },
        resource: 'unknown',
        action: 'unknown'
    }
};