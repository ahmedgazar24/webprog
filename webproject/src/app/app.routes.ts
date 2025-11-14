import { Routes } from '@angular/router';

// Components
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { DepartmentBudgetComponent } from './components/department-budget/department-budget.component';
import { StaffPayrollComponent } from './components/staff-payroll/staff-payroll.component';
import { StudentFeesComponent } from './components/student-fees/student-fees.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignupComponent } from './components/signup/signup.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  { path: 'home', component: HomeComponent },
  { path: 'department', component: DepartmentBudgetComponent },
  { path: 'staff', component: StaffPayrollComponent },
  { path: 'students', component: StudentFeesComponent },
  { path: 'profile', component: ProfileComponent },

  // Default
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Wildcard
  { path: '**', redirectTo: 'home' }
];

