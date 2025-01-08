import { Injectable } from '@nestjs/common';
import { LoggerService } from '@app/logger';
import * as authConfig from './rules/authorization.json';
import { UserRoleEnum } from '@app/shared_types';

interface AuthConfig {
  [role: string]: {
    [resource: string]: {
      [action: string]: boolean;
    };
  };
}

@Injectable()
export class AutzService {
  private readonly authConfig: AuthConfig;
  private readonly logger: LoggerService;

  constructor(logger: LoggerService) {
      this.authConfig = authConfig as AuthConfig;
      this.logger = logger;
  }

  isAuthorized(role: UserRoleEnum, resource: string, action: string): boolean {
    try {
        if (!this.authConfig[role]) {
            this.logAuthzCheck(role, resource, action, false, 'Role not found');
            return false;
        }

        if (!this.authConfig[role][resource]) {
            this.logAuthzCheck(role, resource, action, false, 'Resource not found for role');
            return false;
        }

        if (typeof this.authConfig[role][resource][action] !== 'boolean') {
            this.logAuthzCheck(role, resource, action, false, 'Action not found for resource');
            return false;
        }

        const isAllowed = this.authConfig[role][resource][action];
        this.logAuthzCheck(role, resource, action, isAllowed);
        
        return isAllowed;
    } catch (error) {
        this.logger.error('Authorization check failed', {
            event: 'authorization_error',
            role,
            resource,
            action,
            error: (error as Error).message,
            timestamp: new Date().toISOString()
        });
        throw error;
    }
  }

  private logAuthzCheck(role: string, resource: string, action: string, result: boolean, reason?: string): void {
      this.logger.info('Authorization check', {
          event: 'authorization_check',
          role,
          resource,
          action,
          result: result ? 'allowed' : 'denied',
          ...(reason && { reason }),
          timestamp: new Date().toISOString()
      });
  }
}