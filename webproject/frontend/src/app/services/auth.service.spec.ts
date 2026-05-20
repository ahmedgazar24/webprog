import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { MockStorageService } from '../testing/mock-storage.service';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let storage: MockStorageService;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: StorageService, useClass: MockStorageService },
        { provide: Router, useValue: router }
      ]
    });

    service = TestBed.inject(AuthService);
    storage = TestBed.inject(StorageService) as MockStorageService;

    storage.setLocalItem('mock_users', [
      { id: 1, name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' } as User
    ]);
  });

  it('logs in an existing user and stores auth artifacts', () => {
    const result = service.login('admin@example.com', 'admin123');

    const sessionUser = storage.getSessionItem<User>('current_user');

    expect(result.success).toBeTrue();
    expect(sessionUser?.email).toBe('admin@example.com');
    expect(storage.getCookie('auth_token')).toBeTruthy();
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('rejects invalid credentials without touching session state', () => {
    const result = service.login('admin@example.com', 'wrong');

    expect(result.success).toBeFalse();
    expect(storage.getCookie('auth_token')).toBeNull();
    expect(storage.getSessionItem<User>('current_user')).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('clears session and navigates to login on logout', () => {
    service.login('admin@example.com', 'admin123');

    service.logout();

    expect(storage.getCookie('auth_token')).toBeNull();
    expect(storage.getSessionItem<User>('current_user')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('evaluates role helpers using the current user', () => {
    service.login('admin@example.com', 'admin123');

    expect(service.hasRole('admin')).toBeTrue();
    expect(service.hasAnyRole(['student', 'admin'])).toBeTrue();
    expect(service.hasRole('student')).toBeFalse();
  });
});
