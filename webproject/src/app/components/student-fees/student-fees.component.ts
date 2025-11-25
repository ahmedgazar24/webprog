import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

interface Payment {
  date: string;
  amount: number;
}

interface Student {
  id: number;
  name: string;
  totalFees: number;
  payments: Payment[];
  userId?: number; // Link student to user for data isolation
}

@Component({
  selector: 'app-student-fees',
  templateUrl: './student-fees.component.html',
  styleUrls: ['./student-fees.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class StudentFeesComponent implements OnInit {
  students: Student[] = [];
  currentUserId: number | null = null;
  userRole: string = '';
  canViewAll: boolean = false;

  // Default students for initialization
  private defaultStudents: Student[] = [
    { id: 1, name: 'Ali Ahmed', totalFees: 10000, payments: [
      { date: '2024-01-15', amount: 4000 },
      { date: '2024-02-20', amount: 2000 }
    ]},
    { id: 2, name: 'Mona Saleh', totalFees: 12000, payments: [
      { date: '2024-01-10', amount: 12000 }
    ]},
    { id: 3, name: 'Omar Khaled', totalFees: 8000, payments: [
      { date: '2024-01-20', amount: 3000 },
      { date: '2024-02-25', amount: 2000 }
    ]},
    { id: 4, name: 'Sara Youssef', totalFees: 15000, payments: [
      { date: '2024-01-05', amount: 15000 }
    ]},
    { id: 5, name: 'Hassan Mostafa', totalFees: 9000, payments: [
      { date: '2024-01-12', amount: 4500 },
      { date: '2024-02-18', amount: 3999 }
    ]},
  ];

  constructor(
    private authService: AuthService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUserId = user.id;
      this.userRole = user.role;
      this.canViewAll = user.role === 'admin' || user.role === 'accounting';
      this.loadStudents();
    }
  }

  /**
   * Load students from local storage
   * Admin/Accounting: see all students (from shared storage)
   * Student: see only their own record (filtered from shared storage)
   */
  loadStudents(): void {
    if (!this.currentUserId) return;

    // Use shared storage for all students
    const sharedKey = 'student_fees_all';
    const saved = this.storage.getLocalItem<Student[]>(sharedKey);

    if (saved && saved.length > 0) {
      // Filter based on role
      if (this.canViewAll) {
        // Admin/Accounting: see all students
        this.students = saved;
      } else {
        // Student: see only their own record
        this.students = saved.filter(s => s.userId === this.currentUserId);
        
        // If student has no record yet, create one for them
        if (this.students.length === 0) {
          const studentRecord: Student = {
            id: this.currentUserId,
            name: this.authService.getCurrentUser()?.name || 'Student',
            totalFees: 10000, // Default fees
            payments: [],
            userId: this.currentUserId
          };
          this.students = [studentRecord];
          // Add to shared storage
          const updatedStudents = [...saved, studentRecord];
          this.storage.setLocalItem(sharedKey, updatedStudents);
        }
      }
    } else {
      // Initialize with default data
      if (this.canViewAll) {
        // Admin/Accounting: initialize all default students
        this.students = this.defaultStudents.map(s => ({
          ...s,
          userId: undefined // No userId for admin/accounting view
        }));
      } else {
        // Student: initialize only their own record
        const studentRecord: Student = {
          id: this.currentUserId,
          name: this.authService.getCurrentUser()?.name || 'Student',
          totalFees: 10000, // Default fees
          payments: [],
          userId: this.currentUserId
        };
        this.students = [studentRecord];
      }
      this.saveStudents();
    }
  }

  /**
   * Save students to local storage
   * Admin/Accounting: save all students to shared storage
   * Student: update their own record in shared storage
   */
  saveStudents(): void {
    if (!this.currentUserId) return;
    
    const sharedKey = 'student_fees_all';
    
    if (this.canViewAll) {
      // Admin/Accounting: save all students to shared storage
      this.storage.setLocalItem(sharedKey, this.students);
    } else {
      // Student: update their own record in shared storage
      const existingStudents = this.storage.getLocalItem<Student[]>(sharedKey) || [];
      
      // Remove old record for this student
      const otherStudents = existingStudents.filter(s => s.userId !== this.currentUserId);
      
      // Add updated record
      const updatedStudents = [...otherStudents, ...this.students];
      this.storage.setLocalItem(sharedKey, updatedStudents);
    }
  }

  // Modal states
  showInvoiceModal = false;
  showPaymentModal = false;
  showHistoryModal = false;
  selectedStudent: Student | null = null;
  
  // Form data
  paymentAmount: number = 0;
  paymentDate: string = new Date().toISOString().split('T')[0];

  getPaidTotal(student: Student): number {
    return student.payments.reduce((a, b) => a + b.amount, 0);
  }

  getDueAmount(student: Student): number {
    return student.totalFees - this.getPaidTotal(student);
  }

  openInvoiceModal(studentId: number) {
    this.selectedStudent = this.students.find(s => s.id === studentId) || null;
    this.showInvoiceModal = true;
  }

  closeInvoiceModal() {
    this.showInvoiceModal = false;
    this.selectedStudent = null;
  }

  openPaymentModal(studentId: number) {
    this.selectedStudent = this.students.find(s => s.id === studentId) || null;
    this.paymentAmount = 0;
    this.paymentDate = new Date().toISOString().split('T')[0];
    this.showPaymentModal = true;
  }

  closePaymentModal() {
    this.showPaymentModal = false;
    this.selectedStudent = null;
  }

  markPayment() {
    if (this.selectedStudent && this.paymentAmount > 0) {
      // Students cannot mark payments - only view
      if (!this.canViewAll) {
        return;
      }
      
      this.selectedStudent.payments.push({
        date: this.paymentDate,
        amount: this.paymentAmount
      });
      this.saveStudents(); // Persist to storage
      this.closePaymentModal();
    }
  }

  openHistoryModal(studentId: number) {
    this.selectedStudent = this.students.find(s => s.id === studentId) || null;
    this.showHistoryModal = true;
  }

  closeHistoryModal() {
    this.showHistoryModal = false;
    this.selectedStudent = null;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}



