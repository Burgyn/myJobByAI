import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  template: `
    <div class="header">
      <div class="header-content">
        <i class="material-icons header-icon">person</i>
        <h1>Profil</h1>
      </div>
    </div>
    <div class="content">
      <div class="profile-card">
        <div class="profile-avatar">
          <i class="material-icons">person</i>
        </div>
        <h2>Ján Novák</h2>
        <p class="profile-position">Programátor</p>
        <p class="profile-department">Oddelenie vývoja</p>
      </div>

      <div class="profile-section">
        <h3>Osobné údaje</h3>
        <div class="profile-info">
          <div class="profile-info-item">
            <span class="label">Email:</span>
            <span class="value">jan.novak&#64;firma.sk</span>
          </div>
          <div class="profile-info-item">
            <span class="label">Telefón:</span>
            <span class="value">+421 900 123 456</span>
          </div>
          <div class="profile-info-item">
            <span class="label">Dátum nástupu:</span>
            <span class="value">1.3.2020</span>
          </div>
        </div>
      </div>

      <div class="profile-section">
        <h3>Pracovné údaje</h3>
        <div class="profile-info">
          <div class="profile-info-item">
            <span class="label">Typ úväzku:</span>
            <span class="value">Plný úväzok</span>
          </div>
          <div class="profile-info-item">
            <span class="label">Nadriadený:</span>
            <span class="value">Peter Hlavný</span>
          </div>
          <div class="profile-info-item">
            <span class="label">Zostatok dovolenky:</span>
            <span class="value">15 dní</span>
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

      .profile-card {
        background-color: white;
        border-radius: 8px;
        padding: 24px 16px;
        margin-bottom: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        text-align: center;
      }

      .profile-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-color: #e0e0e0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
      }

      .profile-avatar i {
        font-size: 48px;
        color: #9e9e9e;
      }

      .profile-card h2 {
        margin: 0 0 8px 0;
        font-size: 20px;
        font-weight: 500;
        color: #333;
      }

      .profile-position {
        margin: 0 0 4px 0;
        font-size: 16px;
        color: #666;
      }

      .profile-department {
        margin: 0;
        font-size: 14px;
        color: #888;
      }

      .profile-section {
        background-color: white;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .profile-section h3 {
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 500;
        color: #333;
        border-bottom: 1px solid #eee;
        padding-bottom: 8px;
      }

      .profile-info-item {
        display: flex;
        margin-bottom: 12px;
      }

      .profile-info-item:last-child {
        margin-bottom: 0;
      }

      .label {
        width: 40%;
        font-size: 14px;
        color: #888;
      }

      .value {
        width: 60%;
        font-size: 14px;
        color: #333;
        font-weight: 500;
      }
    `,
  ],
})
export class ProfileComponent {}
