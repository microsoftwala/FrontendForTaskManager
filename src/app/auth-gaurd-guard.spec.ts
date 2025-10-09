import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth-gaurd-guard';
import { AuthService } from './authService/auth-service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should block navigation if no token', () => {
    authServiceSpy.getToken.and.returnValue(null);

    const result = guard.canActivate({ url: '/admin' } as any, {} as any);

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth']);
  });

  it('should allow navigation if token exists and role matches', () => {
    // mock token + role
    spyOn<any>(guard, 'getRole').and.returnValue('admin');
    authServiceSpy.getToken.and.returnValue('fake-token');

    const result = guard.canActivate({ url: '/admin' } as any, {} as any);

    expect(result).toBeTrue();
  });
});
