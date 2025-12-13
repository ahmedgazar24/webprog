import { Injectable } from '@angular/core';

/**
 * Storage Service
 * 
 * Implements three storage mechanisms with appropriate use cases:
 * 
 * 1. Cookies: Small data, sent with HTTP requests, expires automatically
 *    - Use for: Authentication tokens, session IDs
 * 
 * 2. Session Storage: Tab-specific, cleared when tab closes
 *    - Use for: Temporary session data, UI state, current form data
 * 
 * 3. Local Storage: Persistent across sessions, domain-specific
 *    - Use for: User preferences, user-specific data, persistent settings
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  // ==================== COOKIE METHODS ====================
  // Cookies: Small size limit (~4KB), sent with every request
  // Best for: Authentication tokens, session IDs, small flags

  /**
   * Set a cookie with optional expiration days
   */
  setCookie(name: string, value: string, days?: number): void {
    if (typeof document === 'undefined') return;
    
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    
    document.cookie = `${name}=${value}${expires}; path=/; SameSite=Lax`;
  }

  /**
   * Get a cookie value by name
   */
  getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    
    return null;
  }

  /**
   * Delete a cookie
   */
  deleteCookie(name: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  // ==================== SESSION STORAGE METHODS ====================
  // Session Storage: Tab-specific, cleared when tab closes
  // Best for: Temporary session data, current form state, UI preferences

  /**
   * Set an item in session storage
   */
  setSessionItem(key: string, value: any): void {
    if (typeof window === 'undefined' || !window.sessionStorage) return;
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error setting session storage:', e);
    }
  }

  /**
   * Get an item from session storage
   */
  getSessionItem<T>(key: string): T | null {
    if (typeof window === 'undefined' || !window.sessionStorage) return null;
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error getting session storage:', e);
      return null;
    }
  }

  /**
   * Remove an item from session storage
   */
  removeSessionItem(key: string): void {
    if (typeof window === 'undefined' || !window.sessionStorage) return;
    sessionStorage.removeItem(key);
  }

  /**
   * Clear all session storage
   */
  clearSession(): void {
    if (typeof window === 'undefined' || !window.sessionStorage) return;
    sessionStorage.clear();
  }

  // ==================== LOCAL STORAGE METHODS ====================
  // Local Storage: Persistent, domain-specific, ~5-10MB limit
  // Best for: User data, preferences, persistent application state

  /**
   * Set an item in local storage
   */
  setLocalItem(key: string, value: any): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error setting local storage:', e);
    }
  }

  /**
   * Get an item from local storage
   */
  getLocalItem<T>(key: string): T | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error getting local storage:', e);
      return null;
    }
  }

  /**
   * Remove an item from local storage
   */
  removeLocalItem(key: string): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.removeItem(key);
  }

  /**
   * Clear all local storage
   */
  clearLocal(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.clear();
  }

  /**
   * Get user-specific storage key
   * Ensures data isolation between users
   */
  getUserKey(userId: number, baseKey: string): string {
    return `${baseKey}_user_${userId}`;
  }
}
