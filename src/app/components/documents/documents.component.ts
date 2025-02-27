import { Component } from '@angular/core';

@Component({
  selector: 'app-documents',
  template: `
    <div class="header">
      <div class="header-content">
        <i class="material-icons header-icon">description</i>
        <h1>Dokumenty</h1>
      </div>
    </div>
    <div class="content">
      <div class="document-item">
        <div class="document-icon">
          <i class="material-icons">description</i>
        </div>
        <div class="document-info">
          <h2>Zmenový rozpis - Týždeň 13</h2>
          <p>Od: Peter Hlavný</p>
          <p class="date">25.3.2024</p>
        </div>
        <div class="document-actions">
          <button class="btn-reject">Odmietnuť</button>
          <button class="btn-approve">Potvrdiť</button>
        </div>
      </div>

      <div class="document-item">
        <div class="document-icon">
          <i class="material-icons">description</i>
        </div>
        <div class="document-info">
          <h2>Žiadosť o dovolenku</h2>
          <p>Od: Peter Hlavný</p>
          <p class="date">20.3.2024</p>
        </div>
        <div class="document-actions">
          <i class="material-icons document-download">file_download</i>
        </div>
      </div>

      <div class="document-item">
        <div class="document-icon">
          <i class="material-icons">description</i>
        </div>
        <div class="document-info">
          <h2>Ročné zúčtovanie dane 2023</h2>
          <p>Od: Jana Mzdová</p>
          <p class="date">15.1.2024</p>
        </div>
        <div class="document-actions">
          <i class="material-icons document-download">file_download</i>
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

      .content {
        padding: 16px;
        padding-bottom: 60px; /* Dodatočný priestor pre navigačný panel */
      }

      .document-item {
        display: flex;
        background-color: white;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        align-items: center;
      }

      .document-icon {
        margin-right: 16px;
      }

      .document-icon i {
        color: #673ab7;
        font-size: 24px;
      }

      .document-info {
        flex: 1;
      }

      .document-info h2 {
        margin: 0 0 4px 0;
        font-size: 16px;
        font-weight: 500;
      }

      .document-info p {
        margin: 0;
        font-size: 14px;
        color: #666;
      }

      .document-info .date {
        font-size: 12px;
        color: #888;
      }

      .document-actions {
        display: flex;
        gap: 8px;
      }

      .btn-reject {
        background-color: transparent;
        color: #666;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
      }

      .btn-approve {
        background-color: #673ab7;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
      }

      .document-download {
        color: #666;
        cursor: pointer;
      }
    `,
  ],
})
export class DocumentsComponent {}
