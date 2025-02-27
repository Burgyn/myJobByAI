import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Predvolené hodnoty pre demo účely
  private currentUserSubject = new BehaviorSubject<User>({
    tenantId: '129',
    personId: '00113321-8e66-4a34-8527-e4ede0c47714',
    name: 'Ján Novák',
    email: 'jan.novak@firma.sk',
    position: 'Programátor',
    department: 'Oddelenie vývoja',
  });

  constructor() {
    // Tu by sa mohla načítať identita používateľa z API alebo localStorage
  }

  getCurrentUser(): Observable<User> {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUserValue(): User {
    return this.currentUserSubject.value;
  }

  // Metóda pre aktualizáciu používateľa (napr. po prihlásení)
  updateCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }
}
