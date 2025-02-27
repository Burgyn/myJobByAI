import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
      catchError((error) => {
        console.error('Chyba pri načítaní výplatných pások', error);
        // Vrátime prázdne pole v prípade chyby
        return of([]);
      })
    );
  }
}
