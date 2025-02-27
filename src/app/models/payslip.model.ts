export interface EmployeeInsurance {
  healthInsurance: number;
  sicknessInsurance: number;
  oldAgePensionInsurance: number;
  disabilityInsurance: number;
  unemploymentInsurance: number;
}

export interface Deductions {
  advancePayment: number;
  execution: number;
}

export interface AppliedAllowances {
  nonTaxableBase: number;
  healthInsuranceDeduction: number;
}

export interface PayslipModel {
  payslipId: number;
  employeeId: number;
  employeeName: string;
  position: string;
  companyName: string;
  payslipPeriod: string;
  grossWage: number;
  monthlyWage: number;
  monthlyBonus: number;
  wageCompensationForLeave: number;
  employeeInsurance: EmployeeInsurance;
  employeeInsuranceTotal: number;
  taxAdvance: number;
  taxBonus: number;
  tax: number;
  netWage: number;
  sickLeaveCompensation: number;
  deductions: Deductions;
  deductionsTotal: number;
  toAccount: number;
  appliedAllowances: AppliedAllowances;
}
