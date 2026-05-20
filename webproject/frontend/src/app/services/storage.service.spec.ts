import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('persists and retrieves values from local storage', () => {
    const payload = { name: 'Local Test', flag: true };
    service.setLocalItem('local_test', payload);

    expect(service.getLocalItem<{ name: string; flag: boolean }>('local_test'))
      .toEqual(payload);
  });

  it('handles session storage lifecycle operations', () => {
    service.setSessionItem('session_key', { value: 42 });

    expect(service.getSessionItem<{ value: number }>('session_key')?.value).toBe(42);

    service.removeSessionItem('session_key');
    expect(service.getSessionItem('session_key')).toBeNull();

    service.setSessionItem('session_key', { value: 99 });
    service.clearSession();
    expect(service.getSessionItem('session_key')).toBeNull();
  });

  it('builds user-specific keys for isolated storage', () => {
    expect(service.getUserKey(12, 'payroll_entries')).toBe('payroll_entries_user_12');
  });
});
