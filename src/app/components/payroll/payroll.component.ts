import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayrollService } from '../../services/payroll.service';
import { PayslipModel } from '../../models/payslip.model';
import { UserService } from '../../services/user.service';

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
      <div class="employee-selector" *ngIf="payslips && payslips.length > 0">
        <button (click)="previousEmployee()" class="employee-nav-button">
          <i class="material-icons">chevron_left</i>
        </button>
        <span class="current-employee">{{
          payslips[selectedEmployeeIndex].employeeName
        }}</span>
        <button (click)="nextEmployee()" class="employee-nav-button">
          <i class="material-icons">chevron_right</i>
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

      <!-- Zoznam zamestnancov -->
      <div
        *ngIf="!loading && !error && payslips && payslips.length > 0"
        class="employees-list"
      >
        <h2>Zamestnanci</h2>
        <div class="employees-grid">
          <div
            *ngFor="let payslip of payslips; let i = index"
            class="employee-card"
            [class.active]="i === selectedEmployeeIndex"
            (click)="selectEmployee(i)"
          >
            <div class="employee-initials">
              {{ getInitials(payslip.employeeName) }}
            </div>
            <div class="employee-name">{{ payslip.employeeName }}</div>
            <div class="employee-position">{{ payslip.position }}</div>
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
          <div class="chart">
            <div class="chart-center">
              <div class="total-amount">
                {{ selectedPayslip.grossWage.toFixed(2) }} €
              </div>
            </div>
            <svg viewBox="0 0 100 100" class="chart-svg">
              <!-- Zelená časť - čistá mzda -->
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#4CAF50"
                stroke-width="20"
                stroke-dasharray="251.2"
                stroke-dashoffset="0"
                fill="none"
                class="chart-circle net-salary"
              />
              <!-- Červená časť - odvody -->
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#F44336"
                stroke-width="20"
                stroke-dasharray="62.8"
                stroke-dashoffset="251.2"
                fill="none"
                class="chart-circle deductions"
              />
              <!-- Šedá časť - daň -->
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#9E9E9E"
                stroke-width="20"
                stroke-dasharray="37.68"
                stroke-dashoffset="314"
                fill="none"
                class="chart-circle tax"
              />
            </svg>
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
        padding-bottom: 70px;
        background-color: #f5f5f5;
        min-height: 100vh;
      }

      .header {
        background-color: #673ab7;
        color: white;
        padding: 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .header-content {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }

      .header-icon {
        font-size: 24px;
        margin-right: 12px;
      }

      .header h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
      }

      .employee-selector {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 8px;
      }

      .employee-nav-button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
      }

      .current-employee {
        font-size: 16px;
        font-weight: 500;
        margin: 0 16px;
      }

      .content {
        padding: 16px;
      }

      .loading,
      .error {
        text-align: center;
        padding: 32px 16px;
        color: #666;
      }

      .employees-list {
        background-color: white;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      }

      .employees-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 16px;
        margin-top: 16px;
      }

      .employee-card {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 2px solid transparent;
      }

      .employee-card:hover {
        background-color: #f0f0f0;
      }

      .employee-card.active {
        background-color: #ede7f6;
        border-color: #673ab7;
      }

      .employee-initials {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #673ab7;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 12px;
      }

      .employee-name {
        font-size: 14px;
        font-weight: 500;
        color: #333;
        text-align: center;
        margin-bottom: 4px;
      }

      .employee-position {
        font-size: 12px;
        color: #666;
        text-align: center;
      }

      .person-card {
        background-color: white;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        display: flex;
        align-items: center;
      }

      .person-initials {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #673ab7;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: 500;
        margin-right: 16px;
      }

      .person-info {
        flex: 1;
      }

      .person-name {
        font-size: 18px;
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
      }

      .person-position {
        font-size: 14px;
        color: #666;
        margin-bottom: 2px;
      }

      .person-company {
        font-size: 14px;
        color: #666;
        margin-bottom: 2px;
      }

      .person-period {
        font-size: 14px;
        color: #666;
      }

      .payroll-summary {
        background-color: white;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      }

      .chart-container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .chart {
        position: relative;
        width: 200px;
        height: 200px;
        margin-bottom: 16px;
      }

      .chart-center {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }

      .total-amount {
        font-size: 24px;
        font-weight: 700;
        color: #333;
      }

      .chart-svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }

      .chart-circle {
        transition: stroke-dashoffset 0.5s ease-in-out;
      }

      .chart-legend {
        width: 100%;
      }

      .legend-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }

      .legend-color {
        width: 16px;
        height: 16px;
        border-radius: 4px;
        margin-right: 8px;
      }

      .net-salary-color {
        background-color: #4caf50;
      }

      .deductions-color {
        background-color: #f44336;
      }

      .tax-color {
        background-color: #9e9e9e;
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

      .payroll-detail,
      .tax-info {
        background-color: white;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      }

      h2 {
        margin: 0 0 16px 0;
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }

      .payroll-items {
        display: flex;
        flex-direction: column;
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
        font-weight: 700;
      }

      .highlighted .item-name,
      .highlighted .item-amount:not(.negative) {
        color: #333;
      }

      .category-salary {
        /* Štýly pre kategóriu mzdy */
      }

      .category-insurance {
        /* Štýly pre kategóriu poistenia */
      }

      .category-tax {
        /* Štýly pre kategóriu dane */
      }

      .category-deductions {
        /* Štýly pre kategóriu zrážok */
      }

      .category-total {
        /* Štýly pre kategóriu celkom */
        background-color: #f9f9f9;
      }

      .tax-info-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
      }

      .tax-info-item:last-child {
        border-bottom: none;
      }

      .tax-info-name {
        font-size: 14px;
        color: #666;
      }

      .tax-info-value {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }
    `,
  ],
})
export class PayrollComponent implements OnInit {
  selectedEmployeeIndex: number = 0;
  payslips: PayslipModel[] = [];
  selectedPayslip: PayslipModel | null = null;

  loading = false;
  error: string | null = null;

  constructor(
    private payrollService: PayrollService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadPayrollData();
  }

  loadPayrollData(): void {
    this.loading = true;
    this.error = null;

    // Načítanie výplatných pások pomocou API
    this.payrollService.getPersonPayslips().subscribe({
      next: (payslips: PayslipModel[]) => {
        if (payslips && payslips.length > 0) {
          this.payslips = payslips;
          this.selectedEmployeeIndex = 0;
          this.selectedPayslip = this.payslips[this.selectedEmployeeIndex];
          this.loading = false;
        } else {
          this.error = 'Nenašli sa žiadne výplatné pásky.';
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Chyba pri načítaní výplatných pások', err);
        this.error =
          'Nepodarilo sa načítať výplatné pásky. Skúste to prosím neskôr.';
        this.loading = false;
      },
    });
  }

  previousEmployee(): void {
    if (this.payslips.length === 0) return;

    if (this.selectedEmployeeIndex === 0) {
      this.selectedEmployeeIndex = this.payslips.length - 1;
    } else {
      this.selectedEmployeeIndex--;
    }

    this.selectedPayslip = this.payslips[this.selectedEmployeeIndex];
  }

  nextEmployee(): void {
    if (this.payslips.length === 0) return;

    if (this.selectedEmployeeIndex === this.payslips.length - 1) {
      this.selectedEmployeeIndex = 0;
    } else {
      this.selectedEmployeeIndex++;
    }

    this.selectedPayslip = this.payslips[this.selectedEmployeeIndex];
  }

  selectEmployee(index: number): void {
    if (index >= 0 && index < this.payslips.length) {
      this.selectedEmployeeIndex = index;
      this.selectedPayslip = this.payslips[this.selectedEmployeeIndex];
    }
  }

  getInitials(name: string): string {
    if (!name) return '';

    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }
}
