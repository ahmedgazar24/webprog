import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon?: string;
  roles: ('admin' | 'accounting' | 'student' | 'staff')[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: any = null;
  userRole: string = '';
  isAuthenticated: boolean = false;
  isMenuOpen: boolean = false;

  // Navigation items based on roles
  navItems: NavItem[] = [
    { label: 'Home', route: '/home', icon: '🏠', roles: ['admin', 'accounting', 'student', 'staff'] },
    { label: 'Profile', route: '/profile', icon: '👤', roles: ['admin', 'accounting', 'student', 'staff'] },
    { label: 'Users & Authorization', route: '/users', icon: '👥', roles: ['admin', 'accounting', 'student', 'staff'] },
    { label: 'Department Budget', route: '/department', icon: '💰', roles: ['admin', 'accounting'] },
    { label: 'Staff Payroll', route: '/staff', icon: '💼', roles: ['admin', 'accounting', 'staff'] },
    { label: 'Student Fees', route: '/students', icon: '📚', roles: ['admin', 'accounting', 'student'] }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.currentUser) {
      this.userRole = this.currentUser.role;
    }
  }

  getVisibleNavItems(): NavItem[] {
    if (!this.userRole) return [];
    return this.navItems.filter(item => item.roles.includes(this.userRole as any));
  }

  logout(): void {
    this.authService.logout();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  getRoleDisplayName(): string {
    switch(this.userRole) {
      case 'admin':
        return 'Administrator';
      case 'accounting':
        return 'Accounting';
      case 'student':
        return 'Student';
      case 'staff':
        return 'Staff';
      default:
        return 'User';
    }
  }
}

