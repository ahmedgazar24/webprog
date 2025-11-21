import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  
  // Cookie key for auth token (small, sent with requests)
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  // Session storage for current user (cleared on tab close)
  private readonly SESSION_USER_KEY = 'current_user';
  // Local storage for registered users (persistent)
  private readonly USERS_STORAGE_KEY = 'mock_users';

  constructor(
    private router: Router,
    private storage: StorageService
  ) {
    // Initialize with user from session storage
    const sessionUser = this.storage.getSessionItem<User>(this.SESSION_USER_KEY);
    this.currentUserSubject = new BehaviorSubject<User | null>(sessionUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.storage.getCookie(this.AUTH_TOKEN_KEY);
    const user = this.currentUserSubject.value;
    return !!token && !!user;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: 'admin' | 'accounting' | 'student' | 'staff'): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: ('admin' | 'accounting' | 'student' | 'staff')[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  /**
   * Login user
   */
  login(email: string, password: string): { success: boolean; message: string; user?: User } {
    // Get registered users from local storage
    const users: User[] = this.storage.getLocalItem<User[]>(this.USERS_STORAGE_KEY) || [];
    
    // Find user by email
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return { success: false, message: 'User not found. Please sign up first.' };
    }

    // In a real app, passwords should be hashed. For this demo, we compare directly.
    if (user.password !== password) {
      return { success: false, message: 'Invalid password.' };
    }

    // Create auth token (in real app, this would come from server)
    const token = this.generateToken(user.id);
    
    // Store token in cookie (small, sent with requests, expires in 7 days)
    this.storage.setCookie(this.AUTH_TOKEN_KEY, token, 7);
    
    // Store user in session storage (cleared when tab closes)
    this.storage.setSessionItem(this.SESSION_USER_KEY, user);
    
    // Update current user subject
    this.currentUserSubject.next(user);
    
    return { success: true, message: 'Login successful!', user };
  }

  /**
   * Logout user
   */
  logout(): void {
    // Clear cookie
    this.storage.deleteCookie(this.AUTH_TOKEN_KEY);
    
    // Clear session storage
    this.storage.clearSession();
    
    // Update current user
    this.currentUserSubject.next(null);
    
    // Navigate to login
    this.router.navigate(['/login']);
  }

  /**
   * Register new user
   */
  register(userData: Omit<User, 'id'>): { success: boolean; message: string; user?: User } {
    // Get existing users
    const users: User[] = this.storage.getLocalItem<User[]>(this.USERS_STORAGE_KEY) || [];
    
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      return { success: false, message: 'Email already registered.' };
    }

    // Create new user
    const newUser: User = {
      id: Date.now(),
      ...userData
    };

    // Save to local storage (persistent)
    users.push(newUser);
    this.storage.setLocalItem(this.USERS_STORAGE_KEY, users);

    return { success: true, message: 'Registration successful!', user: newUser };
  }

  /**
   * Initialize default users for demo
   */
  initializeDefaultUsers(): void {
    const users: User[] = this.storage.getLocalItem<User[]>(this.USERS_STORAGE_KEY) || [];
    
    // Only initialize if no users exist
    if (users.length === 0) {
      const defaultUsers: User[] = [
        { id: 1, name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
        { id: 2, name: 'Accounting User', email: 'accounting@example.com', password: 'acc123', role: 'accounting' },
        { id: 3, name: 'Student User', email: 'student@example.com', password: 'student123', role: 'student' },
        { id: 4, name: 'Staff User', email: 'staff@example.com', password: 'staff123', role: 'staff' }
      ];
      
      this.storage.setLocalItem(this.USERS_STORAGE_KEY, defaultUsers);
    }
  }

  /**
   * Get user ID for data isolation
   */
  getUserId(): number | null {
    const user = this.getCurrentUser();
    return user?.id || null;
  }

  /**
   * Check if user can access resource
   * Admin: can access everything
   * Accounting: can access financial data (payroll, fees)
   * Staff: can access their own payroll only
   * Student: can only access their own data
   */
  canAccessResource(resourceType: 'payroll' | 'fees' | 'budget' | 'profile', resourceUserId?: number): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Admin can access everything
    if (user.role === 'admin') return true;

    // Accounting can access financial resources
    if (user.role === 'accounting') {
      return resourceType === 'payroll' || resourceType === 'fees' || resourceType === 'budget' || resourceType === 'profile';
    }

    // Staff can access their own payroll
    if (user.role === 'staff') {
      if (resourceType === 'profile') return true;
      if (resourceType === 'payroll' && resourceUserId) {
        return user.id === resourceUserId;
      }
      return resourceType === 'payroll'; // Can access payroll page, but see only own entries
    }

    // Student can only access their own data
    if (user.role === 'student') {
      if (resourceType === 'profile') return true;
      if (resourceType === 'fees' && resourceUserId) {
        return user.id === resourceUserId;
      }
      return false;
    }

    return false;
  }

  /**
   * Generate simple token (in real app, this would be JWT from server)
   */
  private generateToken(userId: number): string {
    return btoa(`${userId}_${Date.now()}_${Math.random()}`);
  }

  /**
   * Validate token (in real app, this would verify JWT)
   */
  private validateToken(token: string): boolean {
    try {
      const decoded = atob(token);
      return decoded.split('_').length === 3;
    } catch {
      return false;
    }
  }
}
