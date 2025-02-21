// @app/shared/decorators/authorize.decorator.ts
import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { AuthorizationGuard } from '../guards';

export const Authorize = (...permissions: string[]) => {
  return applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(AuthorizationGuard)
  );
};