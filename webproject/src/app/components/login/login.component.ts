import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  returnUrl: string = '/home';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize default users if none exist
    this.authService.initializeDefaultUsers();
  }

  ngOnInit(): void {
    // Get return URL from query params or default to home
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    
    // If already authenticated, redirect
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.errorMessage = '';
    
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.isLoading = true;

    // Ensure users are initialized
    this.authService.initializeDefaultUsers();

    // Small delay to ensure storage is ready
    setTimeout(() => {
      const result = this.authService.login(this.email.trim(), this.password);

      if (result.success && result.user) {
        // Login successful - redirect to return URL or home
        this.router.navigate([this.returnUrl]).then(() => {
          this.isLoading = false;
        }).catch(() => {
          this.router.navigate(['/home']);
          this.isLoading = false;
        });
      } else {
        // Login failed
        this.errorMessage = result.message || 'Login failed. Please try again.';
        this.isLoading = false;
      }
    }, 50);
  }
}
