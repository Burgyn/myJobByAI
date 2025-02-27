import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="header">
      <div class="header-content">
        <i class="material-icons header-icon">home</i>
        <h1>Domov</h1>
      </div>
    </div>
    <div class="content">
      <div class="dashboard-card">
        <h2>Vitajte v aplikácii KROS Mzdy</h2>
        <p>
          Tu nájdete všetky informácie o vašej mzde, dochádzke a dokumentoch.
        </p>
      </div>

      <div class="dashboard-card">
        <h2>Aktuálne oznámenia</h2>
        <div class="notification">
          <div class="notification-icon">
            <i class="material-icons">notifications</i>
          </div>
          <div class="notification-content">
            <h3>Nový dokument na schválenie</h3>
            <p>Máte nový dokument, ktorý čaká na vaše schválenie.</p>
            <p class="notification-time">Pred 2 hodinami</p>
          </div>
        </div>

        <div class="notification">
          <div class="notification-icon">
            <i class="material-icons">event</i>
          </div>
          <div class="notification-content">
            <h3>Pripomienka: Výplatný termín</h3>
            <p>Výplata za mesiac marec bude pripísaná 10.4.2024.</p>
            <p class="notification-time">Včera</p>
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

      .dashboard-card {
        background-color: white;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .dashboard-card h2 {
        margin: 0 0 12px 0;
        font-size: 18px;
        color: #333;
      }

      .dashboard-card p {
        margin: 0;
        font-size: 14px;
        color: #666;
      }

      .notification {
        display: flex;
        padding: 12px 0;
        border-bottom: 1px solid #eee;
      }

      .notification:last-child {
        border-bottom: none;
      }

      .notification-icon {
        margin-right: 12px;
      }

      .notification-icon i {
        color: #673ab7;
        font-size: 24px;
      }

      .notification-content {
        flex: 1;
      }

      .notification-content h3 {
        margin: 0 0 4px 0;
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }

      .notification-content p {
        margin: 0;
        font-size: 14px;
        color: #666;
      }

      .notification-time {
        font-size: 12px;
        color: #888;
        margin-top: 4px !important;
      }
    `,
  ],
})
export class HomeComponent {}
