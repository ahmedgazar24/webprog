import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

export interface PayrollEntry {
  id: number;
  employeeName: string;
  position?: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  userId?: number; // Link entry to user for data isolation
  month?: string; // Month for reporting (YYYY-MM format)
  year?: number; // Year for reporting
}

export interface MonthlyReport {
  reportDate: string;
  month: string;
  year: number;
  generatedBy: string;
  entries: PayrollEntry[];
  summary: {
    totalEmployees: number;
    totalBaseSalary: number;
    totalAllowances: number;
    totalDeductions: number;
    totalNetSalary: number;
  };
}

@Component({
  selector: 'app-staff-payroll',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './staff-payroll.component.html',
  styleUrls: ['./staff-payroll.component.css']
})
export class StaffPayrollComponent implements OnInit {
  payrollForm: FormGroup;
  entries: PayrollEntry[] = [];
  editingId: number | null = null;
  currentUserId: number | null = null;
  userRole: string = '';
  canViewAll: boolean = false;
  canEdit: boolean = false;
  
  // Report generation
  selectedMonth: string = '';
  selectedYear: number = new Date().getFullYear();
  reportGenerated: boolean = false;
  reportData: MonthlyReport | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storage: StorageService
  ) {
    this.payrollForm = this.fb.group({
      employeeName: ['', [Validators.required]],
      position: [''],
      baseSalary: [0, [Validators.required, Validators.min(0)]],
      allowances: [0, [Validators.min(0)]],
      deductions: [0, [Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUserId = user.id;
      this.userRole = user.role;
      // Admin and accounting can view/edit all entries
      // Staff can only view/edit their own entries
      this.canViewAll = user.role === 'admin' || user.role === 'accounting';
      this.canEdit = user.role === 'admin' || user.role === 'accounting' || user.role === 'staff';
      
      // Initialize month selector with current month
      const now = new Date();
      this.selectedMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      this.selectedYear = now.getFullYear();
      
      this.load();
    }
  }

  /**
   * Load payroll entries from local storage
   * Admin/Accounting: see all entries (from shared storage)
   * Staff: see only their own entries (where userId matches)
   */
  load() {
    if (!this.currentUserId) return;

    if (this.canViewAll) {
      // Admin/Accounting: Load entries from shared storage
      const sharedKey = 'payroll_entries_all';
      const saved = this.storage.getLocalItem<PayrollEntry[]>(sharedKey);
      this.entries = (saved || []).map((e: any) => ({ ...e }));
    } else {
      // Staff: Load only their own entries
      // First check shared storage, then filter by userId
      const sharedKey = 'payroll_entries_all';
      const sharedEntries = this.storage.getLocalItem<PayrollEntry[]>(sharedKey) || [];
      
      // Also check user-specific storage
      const userKey = this.storage.getUserKey(this.currentUserId, 'payroll_entries');
      const userEntries = this.storage.getLocalItem<PayrollEntry[]>(userKey) || [];
      
      // Combine and filter to only show entries belonging to this staff member
      const allEntries = [...sharedEntries, ...userEntries];
      this.entries = allEntries.filter((e: PayrollEntry) => e.userId === this.currentUserId);
    }
  }

  /**
   * Save payroll entries to local storage
   * Admin/Accounting: save to shared storage
   * Staff: save to both shared storage (with userId) and their own storage
   */
  saveEntries() {
    if (!this.currentUserId) return;

    if (this.canViewAll) {
      // Admin/Accounting: Save to shared storage
      const sharedKey = 'payroll_entries_all';
      this.storage.setLocalItem(sharedKey, this.entries);
    } else {
      // Staff: Save to shared storage (so admin/accounting can see it) and user-specific storage
      const sharedKey = 'payroll_entries_all';
      const existingShared = this.storage.getLocalItem<PayrollEntry[]>(sharedKey) || [];
      
      // Update shared storage: remove old entries for this user, add new ones
      const otherEntries = existingShared.filter(e => e.userId !== this.currentUserId);
      const updatedShared = [...otherEntries, ...this.entries];
      this.storage.setLocalItem(sharedKey, updatedShared);
      
      // Also save to user-specific storage
      const storageKey = this.storage.getUserKey(this.currentUserId, 'payroll_entries');
      this.storage.setLocalItem(storageKey, this.entries);
    }
  }

  addOrUpdate() {
    if (this.payrollForm.invalid || !this.currentUserId) return;
    const v = this.payrollForm.value;
    const net = (+v.baseSalary || 0) + (+v.allowances || 0) - (+v.deductions || 0);
    
    if (this.editingId) {
      const idx = this.entries.findIndex(e => e.id === this.editingId);
      if (idx >= 0) {
        // Staff can only edit their own entries
        if (!this.canViewAll && this.entries[idx].userId !== this.currentUserId) {
          return;
        }
        this.entries[idx] = { 
          id: this.editingId, 
          employeeName: v.employeeName, 
          position: v.position, 
          baseSalary: +v.baseSalary, 
          allowances: +v.allowances, 
          deductions: +v.deductions, 
          netSalary: net,
          userId: this.entries[idx].userId || this.currentUserId // Preserve userId
        };
      }
      this.editingId = null;
    } else {
      // Staff can only add entries for themselves
      const entry: PayrollEntry = { 
        id: Date.now(), 
        employeeName: v.employeeName, 
        position: v.position, 
        baseSalary: +v.baseSalary, 
        allowances: +v.allowances, 
        deductions: +v.deductions, 
        netSalary: net,
        userId: this.currentUserId // Always set to current user for staff
      };
      this.entries.push(entry);
    }
    this.saveEntries();
    this.payrollForm.reset({ employeeName: '', position: '', baseSalary: 0, allowances: 0, deductions: 0 });
  }

  edit(entry: PayrollEntry) {
    this.editingId = entry.id;
    this.payrollForm.setValue({ employeeName: entry.employeeName, position: entry.position || '', baseSalary: entry.baseSalary, allowances: entry.allowances, deductions: entry.deductions });
  }

  remove(id: number) {
    const entry = this.entries.find(e => e.id === id);
    // Staff can only delete their own entries
    if (!this.canViewAll && entry && entry.userId !== this.currentUserId) {
      return;
    }
    this.entries = this.entries.filter(e => e.id !== id);
    this.saveEntries();
  }

  get totalNet() { return this.entries.reduce((s, e) => s + (e.netSalary || 0), 0); }

  /**
   * Generate monthly salary report in JSON format
   */
  generateMonthlyReport(): void {
    if (!this.selectedMonth) {
      alert('Please select a month');
      return;
    }

    const [year, month] = this.selectedMonth.split('-').map(Number);
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    
    // Filter entries for the selected month
    // For now, we'll include all entries (in a real app, entries would have month/year fields)
    // Staff can only see their own entries
    let reportEntries = this.entries;
    
    if (!this.canViewAll) {
      // Staff: only their own entries
      reportEntries = this.entries.filter(e => e.userId === this.currentUserId);
    }

    // Calculate summary
    const summary = {
      totalEmployees: reportEntries.length,
      totalBaseSalary: reportEntries.reduce((sum, e) => sum + (e.baseSalary || 0), 0),
      totalAllowances: reportEntries.reduce((sum, e) => sum + (e.allowances || 0), 0),
      totalDeductions: reportEntries.reduce((sum, e) => sum + (e.deductions || 0), 0),
      totalNetSalary: reportEntries.reduce((sum, e) => sum + (e.netSalary || 0), 0)
    };

    const currentUser = this.authService.getCurrentUser();
    const report: MonthlyReport = {
      reportDate: new Date().toISOString(),
      month: monthStr,
      year: year,
      generatedBy: currentUser?.name || 'Unknown',
      entries: reportEntries.map(e => ({
        ...e,
        month: monthStr,
        year: year
      })),
      summary: summary
    };

    this.reportData = report;
    this.reportGenerated = true;
  }

  /**
   * Download monthly report as JSON file
   */
  downloadReport(): void {
    if (!this.reportData) {
      alert('Please generate a report first');
      return;
    }

    const jsonString = JSON.stringify(this.reportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const monthName = new Date(this.reportData.year, parseInt(this.reportData.month.split('-')[1]) - 1).toLocaleString('default', { month: 'long' });
    const fileName = `salary-report-${this.reportData.month}-${Date.now()}.json`;
    
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Get available months for selection
   */
  getAvailableMonths(): string[] {
    const months: string[] = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    // Generate last 12 months
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, currentMonth - 1 - i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      months.push(`${year}-${month}`);
    }
    
    return months;
  }

  /**
   * Format month string for display
   */
  formatMonth(monthStr: string): string {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }
}
