import { AuthApiGuard } from '../../guards/auth-api.guard';

describe('AuthApiGuard', () => {
  it('should be defined', () => {
    expect(new AuthApiGuard()).toBeDefined();
  });
});
