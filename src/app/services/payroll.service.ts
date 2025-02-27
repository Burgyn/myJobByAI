import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PayslipModel } from '../models/payslip.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class PayrollService {
  private apiUrl =
    'https://krospayrollsemployeeapi20250227140928-eca6bxhsa6dgc3hx.westeurope-01.azurewebsites.net/api/company'; // Nový endpoint API

  constructor(private http: HttpClient, private userService: UserService) {}

  getPersonPayslips(): Observable<PayslipModel[]> {
    const user = this.userService.getCurrentUserValue();
    const url = `${this.apiUrl}/${user.tenantId}/payslips/persons/${user.personId}`;

    return this.http.get<PayslipModel[]>(url).pipe(
      map((payslips) => this.sortPayslipsByDate(payslips)),
      catchError((error) => {
        console.error('Chyba pri načítaní výplatných pások', error);
        // Vrátime prázdne pole v prípade chyby
        return of([]);
      })
    );
  }

  /**
   * Zoradí výplatné pásky podľa dátumu (od najnovšej po najstaršiu)
   */
  private sortPayslipsByDate(payslips: PayslipModel[]): PayslipModel[] {
    return [...payslips].sort((a, b) => {
      // Predpokladáme, že payslipPeriod je v tvare "Mesiac YYYY" (napr. "Marec 2023")
      const dateA = this.parsePayslipPeriod(a.payslipPeriod);
      const dateB = this.parsePayslipPeriod(b.payslipPeriod);

      // Zoradenie od najnovšej po najstaršiu
      return dateB.getTime() - dateA.getTime();
    });
  }

  /**
   * Prevedie textový formát obdobia výplatnej pásky na objekt Date
   */
  private parsePayslipPeriod(period: string): Date {
    try {
      // Rozdelenie reťazca na mesiac a rok
      const parts = period.split(' ');
      if (parts.length < 2) {
        // Ak nemôžeme rozdeliť, vrátime aktuálny dátum
        return new Date();
      }

      const month = this.getMonthNumber(parts[0]);
      const year = parseInt(parts[1], 10);

      // Vytvorenie dátumu pre prvý deň mesiaca
      return new Date(year, month, 1);
    } catch (error) {
      console.error('Chyba pri parsovaní obdobia výplatnej pásky', error);
      return new Date();
    }
  }

  /**
   * Prevedie názov mesiaca na jeho číslo (0-11)
   */
  private getMonthNumber(monthName: string): number {
    const months: { [key: string]: number } = {
      január: 0,
      januára: 0,
      jan: 0,
      február: 1,
      februára: 1,
      feb: 1,
      marec: 2,
      marca: 2,
      mar: 2,
      apríl: 3,
      apríla: 3,
      apr: 3,
      máj: 4,
      mája: 4,
      jún: 5,
      júna: 5,
      jun: 5,
      júl: 6,
      júla: 6,
      jul: 6,
      august: 7,
      augusta: 7,
      aug: 7,
      september: 8,
      septembra: 8,
      sep: 8,
      október: 9,
      októbra: 9,
      okt: 9,
      november: 10,
      novembra: 10,
      nov: 10,
      december: 11,
      decembra: 11,
      dec: 11,
    };

    // Prevod na malé písmená a odstránenie diakritiky pre lepšie porovnanie
    const normalizedMonth = monthName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return months[normalizedMonth] !== undefined ? months[normalizedMonth] : 0;
  }
}
