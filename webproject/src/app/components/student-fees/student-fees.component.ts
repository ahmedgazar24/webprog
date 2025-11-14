import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-fees',
  templateUrl: './student-fees.component.html',
  styleUrls: ['./student-fees.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class StudentFeesComponent {
  students= [
    { id: 1, name: 'Ali Ahmed', totalFees: 10000, paidFees: [4000,2000] },
    { id: 2, name: 'Mona Saleh', totalFees: 12000, paidFees: [12000,0] },
    { id: 3, name: 'Omar Khaled', totalFees: 8000, paidFees: [3000 ,2000] },
    { id: 4, name: 'Sara Youssef', totalFees: 15000, paidFees: [15000 ,0] },
    { id: 5, name: 'Hassan Mostafa', totalFees: 9000, paidFees: [4500 ,3999] },
  ];
  invoice(studentId: number) {
    for(let student of this.students){
      if(student.id === studentId){
        const paidTotal = student.paidFees.reduce((a,b) => a + b, 0);
        const dueAmount = student.totalFees - paidTotal;
        console.log(`Invoice for ${student.name}: Total Fees = ${student.totalFees}, Paid = ${paidTotal}, Due = ${dueAmount}`);
        return;
      }
    }
  }
  paymentHistory(studentId: number) {
    for(let student of this.students){
      if(student.id === studentId){
        console.log(`Payment History for ${student.name}: ${student.paidFees.join(', ')}`);
        return;
      }
    }
  }
  addpayment(studentId: number, amount: number) {
    for(let student of this.students){
      if(student.id === studentId){
        student.paidFees.push(amount);
        console.log(`Added payment of ${amount} for ${student.name}`);
        return;
      }
    }
  }
  getPaidTotal(student: any): number {
    return student.paidFees.reduce((a: number, b: number) => a + b, 0);
  }

}

