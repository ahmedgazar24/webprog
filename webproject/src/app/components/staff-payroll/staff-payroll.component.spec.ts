import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffPayrollComponent, PayrollEntry } from './staff-payroll.component';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { MockStorageService } from '../../testing/mock-storage.service';
import { User } from '../../models/user.model';

class MockAuthService {
  private user: User | null = {
    id: 10,
    name: 'Staff User',
    email: 'staff@test.com',
    password: 'secret',
    role: 'staff'
  };

  setCurrentUser(user: User) {
    this.user = user;
  }

  getCurrentUser(): User | null {
    return this.user;
  }
}

describe('StaffPayrollComponent', () => {
  let component: StaffPayrollComponent;
  let fixture: ComponentFixture<StaffPayrollComponent>;
  let storage: MockStorageService;
  let auth: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffPayrollComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: StorageService, useClass: MockStorageService }
      ]
    }).compileComponents();

    storage = TestBed.inject(StorageService) as MockStorageService;
    auth = TestBed.inject(AuthService) as unknown as MockAuthService;

    fixture = TestBed.createComponent(StaffPayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads only the current staff member entries on init', () => {
    const currentUser = auth.getCurrentUser()!;

    storage.setLocalItem('payroll_entries_all', [
      { id: 1, employeeName: 'Other User', baseSalary: 100, allowances: 0, deductions: 0, netSalary: 100, userId: 99 },
      { id: 2, employeeName: 'Staff User', baseSalary: 200, allowances: 50, deductions: 0, netSalary: 250, userId: currentUser.id }
    ]);
    storage.setLocalItem(storage.getUserKey(currentUser.id, 'payroll_entries'), [
      { id: 3, employeeName: 'Staff Extra', baseSalary: 150, allowances: 0, deductions: 0, netSalary: 150, userId: currentUser.id }
    ]);

    component.load();

    expect(component.entries.length).toBe(2);
    expect(component.entries.every(e => e.userId === currentUser.id)).toBeTrue();
  });

  it('computes net salary and persists entries when adding a record', () => {
    const currentUser = auth.getCurrentUser()!;

    component.payrollForm.setValue({
      employeeName: 'New Staff',
      position: 'Teacher',
      baseSalary: 1000,
      allowances: 250,
      deductions: 100
    });

    component.addOrUpdate();

    const savedEntries = storage.getLocalItem<PayrollEntry[]>('payroll_entries_all')!;
    expect(component.entries.length).toBe(1);
    expect(component.entries[0].netSalary).toBe(1150);
    expect(component.entries[0].userId).toBe(currentUser.id);
    expect(savedEntries[0].employeeName).toBe('New Staff');
  });

  it('produces a monthly report with summary totals', () => {
    component.entries = [
      { id: 1, employeeName: 'Staff A', baseSalary: 800, allowances: 100, deductions: 50, netSalary: 850, userId: 10 },
      { id: 2, employeeName: 'Staff B', baseSalary: 900, allowances: 0, deductions: 0, netSalary: 900, userId: 10 }
    ];
    component.selectedMonth = '2025-02';

    component.generateMonthlyReport();

    expect(component.reportGenerated).toBeTrue();
    expect(component.reportData?.entries.length).toBe(2);
    expect(component.reportData?.summary.totalNetSalary).toBe(1750);
    expect(component.reportData?.summary.totalEmployees).toBe(2);
  });
});
