import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayrollService } from '../../services/payroll.service';
import { PayslipModel } from '../../models/payslip.model';
import { UserService } from '../../services/user.service';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js/auto';
import { registerables } from 'chart.js';

// Registrácia všetkých potrebných komponentov Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="header">
      <div class="header-content">
        <i class="material-icons header-icon">payments</i>
        <h1>Výplatné pásky</h1>
      </div>
      <div class="month-navigation" *ngIf="payslips && payslips.length > 0">
        <button
          type="button"
          (click)="previousMonth()"
          class="month-nav-button"
        >
          <span class="material-icons">chevron_left</span>
        </button>
        <span class="current-month">{{
          payslips[selectedMonthIndex].payslipPeriod
        }}</span>
        <button type="button" (click)="nextMonth()" class="month-nav-button">
          <span class="material-icons">chevron_right</span>
        </button>
      </div>
    </div>

    <div class="content">
      <div *ngIf="loading" class="loading">
        <p>Načítavam výplatné pásky...</p>
      </div>

      <div *ngIf="error" class="error">
        <p>{{ error }}</p>
      </div>

      <!-- Zoznam mesiacov -->
      <div
        *ngIf="!loading && !error && payslips && payslips.length > 0"
        class="months-list"
      >
        <h2>Výplatné pásky podľa mesiacov</h2>
        <div class="months-grid">
          <div
            *ngFor="let payslip of payslips; let i = index"
            class="month-card"
            [class.active]="i === selectedMonthIndex"
            (click)="selectMonth(i)"
          >
            <div class="month-period">{{ payslip.payslipPeriod }}</div>
            <div class="month-amount">{{ payslip.netWage.toFixed(2) }} €</div>
          </div>
        </div>
      </div>

      <!-- Karta s iniciálmi osoby -->
      <div *ngIf="!loading && !error && selectedPayslip" class="person-card">
        <div class="person-initials">
          {{ getInitials(selectedPayslip.employeeName) }}
        </div>
        <div class="person-info">
          <div class="person-name">{{ selectedPayslip.employeeName }}</div>
          <div class="person-position">{{ selectedPayslip.position }}</div>
          <div class="person-company">{{ selectedPayslip.companyName }}</div>
          <div class="person-period">{{ selectedPayslip.payslipPeriod }}</div>
        </div>
      </div>

      <!-- Súhrn výplatnej pásky -->
      <div
        *ngIf="!loading && !error && selectedPayslip"
        class="payroll-summary"
      >
        <div class="chart-container">
          <h3>Rozdelenie hrubej mzdy</h3>
          <div class="chart">
            <div class="chart-center">
              <div class="total-amount">
                {{ selectedPayslip.grossWage.toFixed(2) }} €
              </div>
              <div class="total-label">Hrubá mzda</div>
            </div>
            <canvas #payrollChart class="chart-canvas"></canvas>
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-color net-salary-color"></div>
              <div class="legend-text">Čistá mzda</div>
              <div class="legend-value">
                {{ selectedPayslip.netWage.toFixed(2) }} €
              </div>
            </div>
            <div class="legend-item">
              <div class="legend-color deductions-color"></div>
              <div class="legend-text">Odvody do poisťovní</div>
              <div class="legend-value">
                {{ selectedPayslip.employeeInsuranceTotal.toFixed(2) }} €
              </div>
            </div>
            <div class="legend-item">
              <div class="legend-color tax-color"></div>
              <div class="legend-text">Daň</div>
              <div class="legend-value">
                {{ selectedPayslip.tax.toFixed(2) }} €
              </div>
            </div>
          </div>
        </div>

        <div class="chart-container mt-4 full-width">
          <h3>Vývoj mzdy v čase</h3>
          <div class="chart-wide">
            <canvas #salaryHistoryChart class="chart-canvas"></canvas>
          </div>
        </div>
      </div>

      <!-- Detail výplatnej pásky -->
      <div *ngIf="!loading && !error && selectedPayslip" class="payroll-detail">
        <h2>Detail výplatnej pásky</h2>

        <div class="payroll-items">
          <!-- Mzdové položky -->
          <div class="payroll-item highlighted category-salary">
            <div class="item-name">Hrubá mzda</div>
            <div class="item-amount">
              {{ selectedPayslip.grossWage.toFixed(2) }} €
            </div>
          </div>
          <div class="payroll-item category-salary">
            <div class="item-name">Mesačná mzda</div>
            <div class="item-amount">
              {{ selectedPayslip.monthlyWage.toFixed(2) }} €
            </div>
          </div>
          <div class="payroll-item category-salary">
            <div class="item-name">Mesačná odmena</div>
            <div class="item-amount">
              {{ selectedPayslip.monthlyBonus.toFixed(2) }} €
            </div>
          </div>
          <div class="payroll-item category-salary">
            <div class="item-name">Náhrada mzdy za dovolenku</div>
            <div class="item-amount">
              {{ selectedPayslip.wageCompensationForLeave.toFixed(2) }} €
            </div>
          </div>

          <!-- Poistenie -->
          <div class="payroll-item category-insurance deduction">
            <div class="item-name">Poistenie zamestnanca</div>
            <div class="item-amount negative">
              -{{ selectedPayslip.employeeInsuranceTotal.toFixed(2) }} €
            </div>
          </div>
          <div class="payroll-item category-insurance deduction">
            <div class="item-name">Zdravotné poistenie</div>
            <div class="item-amount negative">
              -{{
                selectedPayslip.employeeInsurance.healthInsurance.toFixed(2)
              }}
              €
            </div>
          </div>
          <div class="payroll-item category-insurance deduction">
            <div class="item-name">Nemocenské poistenie</div>
            <div class="item-amount negative">
              -{{
                selectedPayslip.employeeInsurance.sicknessInsurance.toFixed(2)
              }}
              €
            </div>
          </div>
          <div class="payroll-item category-insurance deduction">
            <div class="item-name">Starobné poistenie</div>
            <div class="item-amount negative">
              -{{
                selectedPayslip.employeeInsurance.oldAgePensionInsurance.toFixed(
                  2
                )
              }}
              €
            </div>
          </div>
          <div class="payroll-item category-insurance deduction">
            <div class="item-name">Invalidné poistenie</div>
            <div class="item-amount negative">
              -{{
                selectedPayslip.employeeInsurance.disabilityInsurance.toFixed(2)
              }}
              €
            </div>
          </div>
          <div class="payroll-item category-insurance deduction">
            <div class="item-name">Poistenie v nezamestnanosti</div>
            <div class="item-amount negative">
              -{{
                selectedPayslip.employeeInsurance.unemploymentInsurance.toFixed(
                  2
                )
              }}
              €
            </div>
          </div>

          <!-- Daň -->
          <div class="payroll-item category-tax deduction">
            <div class="item-name">Daň</div>
            <div class="item-amount negative">
              -{{ selectedPayslip.tax.toFixed(2) }} €
            </div>
          </div>
          <div class="payroll-item category-tax deduction">
            <div class="item-name">Preddavková daň</div>
            <div class="item-amount negative">
              -{{ selectedPayslip.taxAdvance.toFixed(2) }} €
            </div>
          </div>
          <div class="payroll-item category-tax highlighted">
            <div class="item-name">Daňový bonus</div>
            <div class="item-amount">
              {{ selectedPayslip.taxBonus.toFixed(2) }} €
            </div>
          </div>

          <!-- Čistá mzda -->
          <div class="payroll-item category-total highlighted">
            <div class="item-name">Čistá mzda</div>
            <div class="item-amount">
              {{ selectedPayslip.netWage.toFixed(2) }} €
            </div>
          </div>
          <div class="payroll-item category-total">
            <div class="item-name">Náhrada príjmu počas PN</div>
            <div class="item-amount">
              {{ selectedPayslip.sickLeaveCompensation.toFixed(2) }} €
            </div>
          </div>

          <!-- Zrážky -->
          <div class="payroll-item category-deductions deduction">
            <div class="item-name">Zrážky</div>
            <div class="item-amount negative">
              -{{ selectedPayslip.deductionsTotal.toFixed(2) }} €
            </div>
          </div>
          <div class="payroll-item category-deductions deduction">
            <div class="item-name">Záloha</div>
            <div class="item-amount negative">
              -{{ selectedPayslip.deductions.advancePayment.toFixed(2) }} €
            </div>
          </div>
          <div class="payroll-item category-deductions deduction">
            <div class="item-name">Exekúcia</div>
            <div class="item-amount negative">
              -{{ selectedPayslip.deductions.execution.toFixed(2) }} €
            </div>
          </div>

          <!-- Na účet -->
          <div class="payroll-item category-total highlighted">
            <div class="item-name">Na účet</div>
            <div class="item-amount">
              {{ selectedPayslip.toAccount.toFixed(2) }} €
            </div>
          </div>
        </div>
      </div>

      <!-- Uplatnené úľavy -->
      <div *ngIf="!loading && !error && selectedPayslip" class="tax-info">
        <h2>Uplatnené úľavy</h2>

        <div class="tax-info-item">
          <div class="tax-info-name">Nezdaniteľná časť základu dane:</div>
          <div class="tax-info-value">
            {{ selectedPayslip.appliedAllowances.nonTaxableBase.toFixed(2) }} €
          </div>
        </div>

        <div class="tax-info-item">
          <div class="tax-info-name">Odpočítateľná položka na ZP:</div>
          <div class="tax-info-value">
            {{
              selectedPayslip.appliedAllowances.healthInsuranceDeduction.toFixed(
                2
              )
            }}
            €
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        padding-bottom: 70px; /* Priestor pre spodný navigačný panel */
      }

      .header {
        background-color: #673ab7;
        color: white;
        padding: 0 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 10;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .header-content {
        display: flex;
        align-items: center;
      }

      .header-icon {
        font-size: 24px;
        margin-right: 12px;
      }

      .header h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
        text-align: left;
      }

      .month-navigation {
        display: flex;
        align-items: center;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 4px 8px;
      }

      .month-nav-button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }

      .month-nav-button:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }

      .month-nav-button span {
        font-size: 18px;
      }

      .current-month {
        margin: 0 8px;
        font-size: 14px;
        font-weight: 500;
      }

      .content {
        padding: 16px;
        padding-bottom: 60px; /* Dodatočný priestor pre navigačný panel */
      }

      .months-list {
        margin-bottom: 24px;
      }

      .months-list h2 {
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 16px;
        color: #333;
      }

      .months-grid {
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        gap: 12px;
        padding: 8px 0;
        scrollbar-width: thin;
        scrollbar-color: #673ab7 #f0f0f0;
      }

      .months-grid::-webkit-scrollbar {
        height: 6px;
      }

      .months-grid::-webkit-scrollbar-track {
        background: #f0f0f0;
        border-radius: 3px;
      }

      .months-grid::-webkit-scrollbar-thumb {
        background-color: #673ab7;
        border-radius: 3px;
      }

      .month-card {
        flex: 0 0 auto;
        width: 120px;
        background-color: white;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .month-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .month-card.active {
        background-color: #f0ebff;
        border: 2px solid #673ab7;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(103, 58, 183, 0.2);
      }

      .month-period {
        font-weight: 500;
        font-size: 14px;
        color: #333;
        margin-bottom: 8px;
      }

      .month-amount {
        font-size: 16px;
        font-weight: 600;
        color: #673ab7;
      }

      .person-card {
        display: flex;
        align-items: center;
        background-color: white;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .person-initials {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: #673ab7;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 500;
        margin-right: 16px;
      }

      .person-info {
        flex: 1;
      }

      .person-name {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
      }

      .person-position,
      .person-company,
      .person-period {
        font-size: 14px;
        color: #666;
        margin-bottom: 2px;
      }

      .person-period {
        font-weight: 500;
        color: #673ab7;
      }

      .payroll-summary {
        margin-bottom: 24px;
      }

      .chart-container {
        background-color: white;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .chart-container h3 {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-bottom: 16px;
        text-align: center;
      }

      .chart {
        position: relative;
        height: 200px;
        margin-bottom: 16px;
      }

      .chart-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 1;
      }

      .total-amount {
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }

      .total-label {
        font-size: 12px;
        color: #666;
      }

      .chart-canvas {
        width: 100%;
        height: 100%;
      }

      .chart-legend {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .legend-item {
        display: flex;
        align-items: center;
      }

      .legend-color {
        width: 12px;
        height: 12px;
        border-radius: 2px;
        margin-right: 8px;
      }

      .net-salary-color {
        background-color: #673ab7;
      }

      .deductions-color {
        background-color: #ff9800;
      }

      .tax-color {
        background-color: #f44336;
      }

      .legend-text {
        flex: 1;
        font-size: 14px;
        color: #666;
      }

      .legend-value {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }

      .chart-wide {
        height: 250px;
      }

      .mt-4 {
        margin-top: 16px;
      }

      .full-width {
        width: 100%;
      }

      .payroll-detail {
        background-color: white;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .payroll-detail h2 {
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 16px;
        color: #333;
      }

      .payroll-items {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .payroll-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
      }

      .payroll-item:last-child {
        border-bottom: none;
      }

      .item-name {
        font-size: 14px;
        color: #666;
      }

      .item-amount {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }

      .item-amount.negative {
        color: #f44336;
      }

      .highlighted {
        background-color: #f9f9f9;
        padding: 12px 8px;
        border-radius: 8px;
        margin-bottom: 8px;
      }

      .highlighted .item-name,
      .highlighted .item-amount {
        font-weight: 600;
        font-size: 16px;
      }

      .category-salary .item-name {
        color: #2196f3;
      }

      .category-insurance .item-name {
        color: #ff9800;
      }

      .loading,
      .error {
        text-align: center;
        padding: 32px 16px;
        color: #666;
      }

      .error {
        color: #f44336;
      }
    `,
  ],
})
export class PayrollComponent implements OnInit, AfterViewInit {
  @ViewChild('payrollChart') payrollChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('salaryHistoryChart')
  salaryHistoryChartCanvas!: ElementRef<HTMLCanvasElement>;

  selectedMonthIndex: number = 0;
  payslips: PayslipModel[] = [];
  selectedPayslip: PayslipModel | null = null;
  payrollChart: Chart | null = null;
  salaryHistoryChart: Chart | null = null;

  // Ukážkové dáta pre graf vývoja mzdy
  salaryHistory = {
    months: ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún'],
    values: [1200, 1250, 1300, 1280, 1350, 1400],
  };

  loading = false;
  error: string | null = null;

  constructor(
    private payrollService: PayrollService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadPayrollData();
  }

  ngAfterViewInit(): void {
    // Grafy sa vytvoria po načítaní dát
  }

  loadPayrollData(): void {
    this.loading = true;
    this.error = null;

    this.payrollService.getPersonPayslips().subscribe({
      next: (data) => {
        this.payslips = data;
        if (this.payslips.length > 0) {
          this.selectedMonthIndex = 0;
          this.selectedPayslip = this.payslips[0];

          setTimeout(() => {
            this.createOrUpdateChart();
          }, 0);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Chyba pri načítaní výplatných pások', err);
        this.error =
          'Nepodarilo sa načítať výplatné pásky. Skúste to prosím neskôr.';
        this.loading = false;
      },
    });
  }

  previousMonth(): void {
    if (this.selectedMonthIndex > 0) {
      this.selectedMonthIndex--;
      this.selectedPayslip = this.payslips[this.selectedMonthIndex];
      this.createOrUpdateChart();
    }
  }

  nextMonth(): void {
    if (this.selectedMonthIndex < this.payslips.length - 1) {
      this.selectedMonthIndex++;
      this.selectedPayslip = this.payslips[this.selectedMonthIndex];
      this.createOrUpdateChart();
    }
  }

  selectMonth(index: number): void {
    this.selectedMonthIndex = index;
    this.selectedPayslip = this.payslips[index];
    this.createOrUpdateChart();
  }

  getInitials(name: string): string {
    if (!name) return '';

    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  }

  createOrUpdateChart(): void {
    if (this.selectedPayslip) {
      this.createPayrollDistributionChart();
      this.createSalaryHistoryChart();
    }
  }

  createPayrollDistributionChart(): void {
    if (!this.selectedPayslip || !this.payrollChartCanvas) return;

    const netWage = this.selectedPayslip.netWage;
    const insuranceTotal = this.selectedPayslip.employeeInsuranceTotal;
    const tax = this.selectedPayslip.tax;
    const total = netWage + insuranceTotal + tax;

    // Percentuálne hodnoty pre lepšiu vizualizáciu
    const netWagePercent = ((netWage / total) * 100).toFixed(1);
    const insuranceTotalPercent = ((insuranceTotal / total) * 100).toFixed(1);
    const taxPercent = ((tax / total) * 100).toFixed(1);

    // Ak už existuje graf, zničíme ho
    if (this.payrollChart) {
      this.payrollChart.destroy();
    }

    // Vytvoríme nový graf
    this.payrollChart = new Chart(this.payrollChartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Čistá mzda', 'Odvody do poisťovní', 'Daň'],
        datasets: [
          {
            data: [netWage, insuranceTotal, tax],
            backgroundColor: ['#4CAF50', '#F44336', '#9E9E9E'],
            hoverBackgroundColor: ['#66BB6A', '#EF5350', '#BDBDBD'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1000,
          easing: 'easeOutQuart',
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#333',
            bodyColor: '#333',
            borderColor: '#ddd',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              label: function (context) {
                const value = context.raw as number;
                const percent = context.parsed as number;
                const percentValue = (
                  (percent /
                    context.dataset.data.reduce(
                      (a, b) => a + (b as number),
                      0
                    )) *
                  100
                ).toFixed(1);
                return `${context.label}: ${value.toFixed(
                  2
                )} € (${percentValue}%)`;
              },
              labelTextColor: function (context) {
                return '#333';
              },
            },
          },
        },
      },
    });
  }

  createSalaryHistoryChart(): void {
    if (!this.salaryHistoryChartCanvas) return;

    const ctx = this.salaryHistoryChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Zrušenie existujúceho grafu, ak existuje
    if (this.salaryHistoryChart) {
      this.salaryHistoryChart.destroy();
    }

    // Vytvorenie nových dát pre graf - použijeme reálne dáta z výplatných pások
    const months: string[] = [];
    const values: number[] = [];

    // Zoradenie výplatných pások podľa obdobia (od najstaršej po najnovšiu)
    const sortedPayslips = [...this.payslips].sort((a, b) => {
      return (
        new Date(a.payslipPeriod).getTime() -
        new Date(b.payslipPeriod).getTime()
      );
    });

    // Extrakcia mesiacov a hodnôt čistej mzdy
    sortedPayslips.forEach((payslip) => {
      months.push(payslip.payslipPeriod);
      values.push(payslip.netWage);
    });

    // Vytvorenie grafu
    this.salaryHistoryChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Čistá mzda',
            data: values,
            borderColor: '#673AB7',
            backgroundColor: 'rgba(103, 58, 183, 0.1)',
            borderWidth: 2,
            pointBackgroundColor: '#673AB7',
            pointBorderColor: '#fff',
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${context.parsed.y.toFixed(
                  2
                )} €`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
              callback: function (value) {
                return value + ' €';
              },
            },
          },
        },
      },
    });
  }
}
