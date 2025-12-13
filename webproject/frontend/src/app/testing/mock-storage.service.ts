import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';

/**
 * Mock storage service that keeps data in memory so our unit tests
 * stay fast and deterministic without touching the real browser APIs.
 */
@Injectable()
export class MockStorageService extends StorageService {
  private localStore = new Map<string, any>();
  private sessionStore = new Map<string, any>();
  private cookies = new Map<string, string>();

  override setLocalItem(key: string, value: any): void {
    this.localStore.set(key, this.clone(value));
  }

  override getLocalItem<T>(key: string): T | null {
    return this.localStore.has(key) ? this.clone(this.localStore.get(key)) : null;
  }

  override removeLocalItem(key: string): void {
    this.localStore.delete(key);
  }

  override clearLocal(): void {
    this.localStore.clear();
  }

  override setSessionItem(key: string, value: any): void {
    this.sessionStore.set(key, this.clone(value));
  }

  override getSessionItem<T>(key: string): T | null {
    return this.sessionStore.has(key) ? this.clone(this.sessionStore.get(key)) : null;
  }

  override removeSessionItem(key: string): void {
    this.sessionStore.delete(key);
  }

  override clearSession(): void {
    this.sessionStore.clear();
  }

  override setCookie(name: string, value: string): void {
    this.cookies.set(name, value);
  }

  override getCookie(name: string): string | null {
    return this.cookies.has(name) ? this.cookies.get(name)! : null;
  }

  override deleteCookie(name: string): void {
    this.cookies.delete(name);
  }

  private clone<T>(value: T): T {
    return value === undefined ? value : JSON.parse(JSON.stringify(value));
  }
}

