import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface PayrollEntry {
  id: number;
  employeeName: string;
  position?: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
}

@Component({
  selector: 'app-staff-payroll',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './staff-payroll.component.html',
  styleUrls: ['./staff-payroll.component.css']
})
export class StaffPayrollComponent {
  payrollForm: FormGroup;
  entries: PayrollEntry[] = [];
  editingId: number | null = null;

  constructor(private fb: FormBuilder) {
    this.payrollForm = this.fb.group({
      employeeName: ['', [Validators.required]],
      position: [''],
      baseSalary: [0, [Validators.required, Validators.min(0)]],
      allowances: [0, [Validators.min(0)]],
      deductions: [0, [Validators.min(0)]]
    });
    this.load();
  }

  load() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = JSON.parse(localStorage.getItem('payroll_entries') || '[]');
      this.entries = (saved || []).map((e: any) => ({ ...e }));
    }
  }

  saveEntries() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('payroll_entries', JSON.stringify(this.entries));
    }
  }

  addOrUpdate() {
    if (this.payrollForm.invalid) return;
    const v = this.payrollForm.value;
    const net = (+v.baseSalary || 0) + (+v.allowances || 0) - (+v.deductions || 0);
    if (this.editingId) {
      const idx = this.entries.findIndex(e => e.id === this.editingId);
      if (idx >= 0) {
        this.entries[idx] = { id: this.editingId, employeeName: v.employeeName, position: v.position, baseSalary: +v.baseSalary, allowances: +v.allowances, deductions: +v.deductions, netSalary: net };
      }
      this.editingId = null;
    } else {
      const entry: PayrollEntry = { id: Date.now(), employeeName: v.employeeName, position: v.position, baseSalary: +v.baseSalary, allowances: +v.allowances, deductions: +v.deductions, netSalary: net };
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
    this.entries = this.entries.filter(e => e.id !== id);
    this.saveEntries();
  }

  get totalNet() { return this.entries.reduce((s, e) => s + (e.netSalary || 0), 0); }
}
