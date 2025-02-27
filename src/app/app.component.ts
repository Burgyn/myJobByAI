import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MessagesComponent } from './components/messages/messages.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PlusComponent } from './components/plus/plus.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent, MessagesComponent, DocumentsComponent, ProfileComponent, PlusComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'kros-payrolls-employee';
}
