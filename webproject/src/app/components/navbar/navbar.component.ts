import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

interface NavItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  navItems: NavItem[] = [];
  private sub?: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to auth changes so nav updates immediately after login/logout
    this.sub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.navItems = this.buildNavItems(user);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }

  private buildNavItems(user: User | null): NavItem[] {
    if (!user) {
      return [
        { label: 'Home', path: '/home' },
        { label: 'Login', path: '/login' },
        { label: 'Sign Up', path: '/signup' }
      ];
    }

    switch (user.role) {
      case 'admin':
        return [
          { label: 'Home', path: '/home' },
          { label: 'Profile', path: '/profile' },
          { label: 'Department Budget', path: '/department' },
          { label: 'Staff Payroll', path: '/staff' },
          { label: 'Student Fees', path: '/students' }
        ];
      case 'accounting':
        return [
          { label: 'Home', path: '/home' },
          { label: 'Profile', path: '/profile' },
          { label: 'Department Budget', path: '/department' },
          { label: 'Staff Payroll', path: '/staff' },
          { label: 'Student Fees', path: '/students' }
        ];
      case 'staff':
        return [
          { label: 'Home', path: '/home' },
          { label: 'Profile', path: '/profile' },
          { label: 'Staff Payroll', path: '/staff' }
        ];
      case 'student':
      default:
        return [
          { label: 'Home', path: '/home' },
          { label: 'Profile', path: '/profile' },
          { label: 'Student Fees', path: '/students' }
        ];
    }
  }
}

