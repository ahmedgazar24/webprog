import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { User } from '../../models/user.model';

interface AccessInfo {
  resource: string;
  description: string;
  access: 'Full' | 'Limited' | 'None' | 'Own Only';
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  currentUser: User | null = null;
  authorizationMatrix: { [key: string]: AccessInfo[] } = {};

  constructor(
    private authService: AuthService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.currentUser = this.authService.getCurrentUser();
    this.initializeAuthorizationMatrix();
  }

  loadUsers(): void {
    const users = this.storage.getLocalItem<User[]>('mock_users') || [];
    this.users = users;
  }

  initializeAuthorizationMatrix(): void {
    // Admin access
    this.authorizationMatrix['admin'] = [
      { resource: 'Home', description: 'Dashboard and navigation', access: 'Full' },
      { resource: 'Profile', description: 'View and edit own profile', access: 'Full' },
      { resource: 'Department Budget', description: 'View and manage all department budgets', access: 'Full' },
      { resource: 'Staff Payroll', description: 'View and manage all staff payroll entries', access: 'Full' },
      { resource: 'Student Fees', description: 'View and manage all student fees', access: 'Full' },
      { resource: 'Users Management', description: 'View all users and their roles', access: 'Full' }
    ];

    // Accounting access
    this.authorizationMatrix['accounting'] = [
      { resource: 'Home', description: 'Dashboard and navigation', access: 'Full' },
      { resource: 'Profile', description: 'View and edit own profile', access: 'Full' },
      { resource: 'Department Budget', description: 'View and manage all department budgets', access: 'Full' },
      { resource: 'Staff Payroll', description: 'View and manage all staff payroll entries', access: 'Full' },
      { resource: 'Student Fees', description: 'View and manage all student fees', access: 'Full' },
      { resource: 'Users Management', description: 'View all users and their roles', access: 'Limited' }
    ];

    // Student access
    this.authorizationMatrix['student'] = [
      { resource: 'Home', description: 'Dashboard and navigation', access: 'Full' },
      { resource: 'Profile', description: 'View and edit own profile', access: 'Full' },
      { resource: 'Department Budget', description: 'View department budgets', access: 'None' },
      { resource: 'Staff Payroll', description: 'View staff payroll', access: 'None' },
      { resource: 'Student Fees', description: 'View own student fees only', access: 'Own Only' },
      { resource: 'Users Management', description: 'View all users and their roles', access: 'Limited' }
    ];
  }

  getAccessForRole(role: string): AccessInfo[] {
    return this.authorizationMatrix[role] || [];
  }

  getAccessClass(access: string): string {
    switch(access) {
      case 'Full':
        return 'access-full';
      case 'Limited':
        return 'access-limited';
      case 'Own Only':
        return 'access-own';
      case 'None':
        return 'access-none';
      default:
        return '';
    }
  }

  getRoleDisplayName(role: string): string {
    switch(role) {
      case 'admin':
        return 'Administrator';
      case 'accounting':
        return 'Accounting Personnel';
      case 'student':
        return 'Student';
      default:
        return role;
    }
  }

  getRoleDescription(role: string): string {
    switch(role) {
      case 'admin':
        return 'Full system access. Can view and manage all resources across the application.';
      case 'accounting':
        return 'Financial data access. Can view and manage all financial resources (budgets, payroll, fees).';
      case 'student':
        return 'Limited access. Can only view own profile and student fees. Cannot access financial management.';
      default:
        return '';
    }
  }

  getUsersByRole(role: string): User[] {
    return this.users.filter(u => u.role === role);
  }
}

