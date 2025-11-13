import { Routes,RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { DepartmentBudgetComponent } from './components/department-budget/department-budget.component';
import { StaffPayrollComponent } from './components/staff-payroll/staff-payroll.component';
import { StudentFeesComponent } from './components/student-fees/student-fees.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignupComponent } from './components/signup/signup.component';

export const routes: Routes = [

  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'department', component: DepartmentBudgetComponent},
  {path: 'staff', component: StaffPayrollComponent},
  {path: 'students', component: StudentFeesComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'signup', component: SignupComponent},
  {path: '**', redirectTo: 'home'}

];
export class AppRoutesModule {}
