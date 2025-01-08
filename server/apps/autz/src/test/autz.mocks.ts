import { UserRoleEnum } from "@app/shared_types";

// Mock services
export var mockLoggerService = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
};

export var mockAutzService = {
    isAuthorized: jest.fn(),
};

// Mock payloads
export var mockAutzPayloads = {
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