import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MessagesComponent } from './components/messages/messages.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PlusComponent } from './components/plus/plus.component';
import { PayrollComponent } from './components/payroll/payroll.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'documents', component: DocumentsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'plus', component: PlusComponent },
  { path: 'payroll', component: PayrollComponent },
];
