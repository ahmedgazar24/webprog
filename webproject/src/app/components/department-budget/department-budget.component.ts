// src/app/components/department-budget/department-budget.component.ts
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService, Department } from '../../services/mock-data.service';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-department-budget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-budget.component.html',
  styleUrls: ['./department-budget.component.css']
})
export class DepartmentBudgetComponent implements AfterViewInit, OnDestroy {
  departments: Department[] = [];
  @ViewChild('budgetChart', { static: false }) chartRef!: ElementRef<HTMLCanvasElement>;
  chart?: Chart;

  // For quick add/edit demo
  newDeptName = '';
  newDeptIncome = 0;
  newDeptExpenses = 0;

  constructor(private mock: MockDataService) {
    this.departments = this.mock.getDepartments();
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  renderChart() {
    if (!this.chartRef) return;
    const labels = this.departments.map(d => d.name);
    const incomes = this.departments.map(d => d.income);
    const expenses = this.departments.map(d => d.expenses);

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Income', data: incomes },
          { label: 'Expenses', data: expenses }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: { mode: 'index', intersect: false },
        },
        scales: {
          x: { stacked: false },
          y: { beginAtZero: true }
        }
      }
    };

    this.chart?.destroy();
    this.chart = new Chart(this.chartRef.nativeElement.getContext('2d')!, config);
  }

  addDepartment() {
    if (!this.newDeptName) return;
    const nextId = (Math.max(0, ...this.departments.map(d => d.id)) + 1);
    this.departments.push({
      id: nextId,
      name: this.newDeptName,
      income: Number(this.newDeptIncome) || 0,
      expenses: Number(this.newDeptExpenses) || 0
    });
    this.newDeptName = '';
    this.newDeptIncome = 0;
    this.newDeptExpenses = 0;
    this.renderChart();
  }

  updateValues() {
    // in real app we would persist; here just re-render chart
    this.renderChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}

