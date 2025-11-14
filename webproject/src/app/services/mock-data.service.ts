// src/app/services/mock-data.service.ts
import { Injectable } from '@angular/core';

export interface Department {
  id: number;
  name: string;
  income: number;
  expenses: number;
}

export interface Invoice {
  id: number;
  studentId: number;
  studentName: string;
  amount: number;
  issuedAt: string; // ISO date
  paid: boolean;
  payments?: { date: string; amount: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  departments: Department[] = [
    { id: 1, name: 'Computer Science', income: 90000, expenses: 55000 },
    { id: 2, name: 'Business', income: 60000, expenses: 42000 },
    { id: 3, name: 'Design', income: 30000, expenses: 18000 },
  ];

  invoices: Invoice[] = [
    { id: 1, studentId: 101, studentName: 'Ali Ahmed', amount: 10000, issuedAt: new Date().toISOString(), paid: false, payments: [] },
    { id: 2, studentId: 102, studentName: 'Mona Saleh', amount: 12000, issuedAt: new Date().toISOString(), paid: true, payments: [{ date: new Date().toISOString(), amount: 12000 }] },
  ];

  nextInvoiceId = 3;

  getDepartments() {
    return JSON.parse(JSON.stringify(this.departments)) as Department[];
  }

  getInvoices() {
    return JSON.parse(JSON.stringify(this.invoices)) as Invoice[];
  }

  createInvoice(payload: Partial<Invoice>) {
    const inv: Invoice = {
      id: this.nextInvoiceId++,
      studentId: payload.studentId ?? 0,
      studentName: payload.studentName ?? 'Unknown',
      amount: payload.amount ?? 0,
      issuedAt: (payload.issuedAt ?? new Date().toISOString()),
      paid: false,
      payments: []
    };
    this.invoices.push(inv);
    return JSON.parse(JSON.stringify(inv)) as Invoice;
  }

  markInvoicePaid(id: number, paymentAmount?: number) {
    const inv = this.invoices.find(i => i.id === id);
    if (!inv) return null;
    const payAmt = paymentAmount ?? inv.amount;
    inv.payments = inv.payments ?? [];
    inv.payments.push({ date: new Date().toISOString(), amount: payAmt });
    inv.paid = inv.payments.reduce((s, p) => s + p.amount, 0) >= inv.amount;
    return JSON.parse(JSON.stringify(inv)) as Invoice;
  }
}

