import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plus',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="header">
      <div class="header-content">
        <i class="material-icons header-icon">add_circle</i>
        <h1>Pridať</h1>
      </div>
    </div>

    <div class="content">
      <div class="token-section">
        <h2>API Token</h2>
        <div class="token-input-container">
          <input
            type="text"
            class="token-input"
            placeholder="Zadajte Bearer token"
            [(ngModel)]="bearerToken"
            (input)="saveToken()"
          />
          <button class="token-save-btn" (click)="saveToken()">Uložiť</button>
        </div>
        <p class="token-info" *ngIf="tokenSaved">Token bol úspešne uložený!</p>
      </div>

      <div class="add-options">
        <div class="option-card">
          <div class="icon">
            <i class="material-icons">description</i>
          </div>
          <div class="option-text">
            <h3>Nový dokument</h3>
            <p>Nahrať alebo vytvoriť nový dokument</p>
          </div>
        </div>

        <div class="option-card">
          <div class="icon">
            <i class="material-icons">message</i>
          </div>
          <div class="option-text">
            <h3>Nová správa</h3>
            <p>Napísať novú správu kolegovi</p>
          </div>
        </div>

        <div class="option-card">
          <div class="icon">
            <i class="material-icons">event</i>
          </div>
          <div class="option-text">
            <h3>Nová udalosť</h3>
            <p>Pridať udalosť do kalendára</p>
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
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        position: sticky;
        top: 0;
        z-index: 10;
        height: 64px;
        display: flex;
        align-items: center;
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
        font-size: 1.5rem;
        font-weight: 500;
        text-align: left;
      }

      .content {
        padding: 16px;
        padding-bottom: 60px; /* Dodatočný priestor pre navigačný panel */
      }

      .token-section {
        background-color: white;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 24px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .token-section h2 {
        margin: 0 0 16px 0;
        font-size: 18px;
        color: #333;
      }

      .token-input-container {
        display: flex;
        gap: 8px;
      }

      .token-input {
        flex: 1;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }

      .token-save-btn {
        background-color: #673ab7;
        color: white;
        border: none;
        padding: 0 16px;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
      }

      .token-info {
        margin: 8px 0 0 0;
        font-size: 14px;
        color: #4caf50;
      }

      .add-options {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .option-card {
        background-color: white;
        border-radius: 8px;
        padding: 16px;
        display: flex;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .option-card:hover {
        background-color: #f5f0ff;
      }

      .icon {
        background-color: #f0f0f0;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
      }

      .icon i {
        color: #673ab7;
        font-size: 24px;
      }

      .option-text h3 {
        margin: 0 0 4px 0;
        font-size: 1rem;
        font-weight: 500;
      }

      .option-text p {
        margin: 0;
        color: #666;
        font-size: 0.875rem;
      }
    `,
  ],
})
export class PlusComponent {
  bearerToken: string = '';
  tokenSaved: boolean = false;

  constructor() {
    // Načítanie tokenu z localStorage pri inicializácii
    const savedToken = localStorage.getItem('bearerToken');
    if (savedToken) {
      this.bearerToken = savedToken;
      this.tokenSaved = true;
    }
  }

  saveToken() {
    if (this.bearerToken) {
      localStorage.setItem('bearerToken', this.bearerToken);
      this.tokenSaved = true;
    }
  }
}
