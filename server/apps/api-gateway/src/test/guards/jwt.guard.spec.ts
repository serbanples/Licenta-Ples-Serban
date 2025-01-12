import { Test, TestingModule } from '@nestjs/testing';
import { JwtGuard } from '../../guards/jwt.guard';
import { AuthApiService } from '../../auth-api/auth-api.service';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { RequestWrapper } from '@app/shared';

/* eslint-disable @typescript-eslint/explicit-function-return-type */

describe('JwtGuard', () => {
  let jwtGuard: JwtGuard;
  let authApiService: AuthApiService;

  beforeEach(async () => {
    const mockAuthApiService = {
      whoami: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtGuard,
        { provide: AuthApiService, useValue: mockAuthApiService },
      ],
    }).compile();

    jwtGuard = module.get<JwtGuard>(JwtGuard);
    authApiService = module.get<AuthApiService>(AuthApiService);
  });

  it('should be defined', () => {
    expect(jwtGuard).toBeDefined();
  });

  describe('canActivate', () => {
    let request: RequestWrapper;

    beforeEach(() => {
      request = {
        cookies: {},
        user: null,
      } as unknown as RequestWrapper;
    });

    it('should throw UnauthorizedException if token is missing', () => {
      request.cookies['accessToken'] = undefined;

      expect(() => jwtGuard.canActivate({ switchToHttp: () => ({ getRequest: () => request }) } as ExecutionContext)).toThrowError(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException if the token is invalid', (done) => {
      request.cookies['accessToken'] = 'invalid-token';
      
      (authApiService.whoami as jest.Mock).mockReturnValueOnce(throwError(() => new Error('Invalid token')));

      jwtGuard.canActivate({ switchToHttp: () => ({ getRequest: () => request }) } as ExecutionContext)
        .subscribe({
          error: (err) => {
            expect(err).toBeInstanceOf(UnauthorizedException); 
            done();
          },
        });
    });

    it('should set user on request and return true if token is valid', (done) => {
      request.cookies['accessToken'] = 'valid-token';

      const userContext = { id: 1, username: 'test-user' }; // Mock user context
      (authApiService.whoami as jest.Mock).mockReturnValueOnce(of(userContext));

      jwtGuard.canActivate({ switchToHttp: () => ({ getRequest: () => request }) } as ExecutionContext).subscribe((result) => {
        expect(result).toBe(true); 
        expect(request.user).toEqual(userContext); 
        done();
      });
    });
  });
});
