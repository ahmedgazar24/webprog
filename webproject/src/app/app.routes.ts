import { Routes } from '@angular/router';

// Components
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { DepartmentBudgetComponent } from './components/department-budget/department-budget.component';
import { StaffPayrollComponent } from './components/staff-payroll/staff-payroll.component';
import { StudentFeesComponent } from './components/student-fees/student-fees.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignupComponent } from './components/signup/signup.component';
import { UsersComponent } from './components/users/users.component';

// Guards
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Public routes - no authentication required
  { path: 'home', component: HomeComponent },
  
  // Protected routes - require authentication
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'users', component: UsersComponent, canActivate: [authGuard] },
  
  // Financial routes - require accounting or admin role
  { 
    path: 'department', 
    component: DepartmentBudgetComponent, 
    canActivate: [authGuard, roleGuard(['admin', 'accounting'])]
  },
  { 
    path: 'staff', 
    component: StaffPayrollComponent, 
    canActivate: [authGuard, roleGuard(['admin', 'accounting', 'staff'])]
  },
  { 
    path: 'students', 
    component: StudentFeesComponent, 
    canActivate: [authGuard, roleGuard(['admin', 'accounting', 'student'])]
  },

  // Default
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Wildcard
  { path: '**', redirectTo: 'home' }
];

