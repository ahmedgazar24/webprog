import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  currentUser: any = null;
  userRole: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.userRole = this.currentUser.role;
    }
  }

  logout() {
    this.authService.logout();
  }

  canAccess(route: string): boolean {
    if (!this.currentUser) return false;
    
    switch(route) {
      case 'department':
        return this.userRole === 'admin' || this.userRole === 'accounting';
      case 'staff':
        return this.userRole === 'admin' || this.userRole === 'accounting' || this.userRole === 'staff';
      case 'students':
        return this.userRole === 'admin' || this.userRole === 'accounting' || this.userRole === 'student';
      default:
        return true;
    }
  }
}
