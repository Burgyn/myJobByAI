import { Component } from '@angular/core';

@Component({
  selector: 'app-messages',
  template: `
    <div class="header">
      <div class="header-content">
        <i class="material-icons header-icon">chat</i>
        <h1>Správy</h1>
      </div>
    </div>
    <div class="content">
      <div class="message-list">
        <div class="message-item">
          <div class="message-avatar">
            <i class="material-icons">person</i>
          </div>
          <div class="message-content">
            <div class="message-header">
              <h2>Mária Nováková</h2>
              <span class="message-time">10:30</span>
            </div>
            <p class="message-preview">
              Dobrý deň, chcela by som sa informovať ohľadom mojej dovolenky...
            </p>
          </div>
        </div>

        <div class="message-item unread">
          <div class="message-avatar">
            <i class="material-icons">person</i>
          </div>
          <div class="message-content">
            <div class="message-header">
              <h2>Ján Kováč</h2>
              <span class="message-time">Včera</span>
            </div>
            <p class="message-preview">
              Prosím o schválenie mojej žiadosti o dovolenku na budúci týždeň.
            </p>
          </div>
        </div>

        <div class="message-item">
          <div class="message-avatar">
            <i class="material-icons">person</i>
          </div>
          <div class="message-content">
            <div class="message-header">
              <h2>Peter Hlavný</h2>
              <span class="message-time">20.3.</span>
            </div>
            <p class="message-preview">
              Posielam vám aktualizovaný rozpis zmien na apríl.
            </p>
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

      .message-list {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        width: 100%;
        overflow: hidden;
      }

      .message-item {
        display: flex;
        padding: 16px;
        border-bottom: 1px solid #eee;
        width: 100%;
      }

      .message-item:last-child {
        border-bottom: none;
      }

      .message-item.unread {
        background-color: #f5f0ff;
      }

      .message-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #e0e0e0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        flex-shrink: 0;
      }

      .message-avatar i {
        color: #9e9e9e;
      }

      .message-content {
        flex: 1;
        min-width: 0; /* Dôležité pre správne zalamovanie */
        overflow: hidden;
      }

      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
      }

      .message-header h2 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .message-time {
        font-size: 12px;
        color: #888;
        flex-shrink: 0;
        margin-left: 8px;
      }

      .message-preview {
        margin: 0;
        font-size: 14px;
        color: #666;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        word-wrap: break-word;
      }

      .message-item.unread .message-preview {
        color: #333;
        font-weight: 500;
      }
    `,
  ],
})
export class MessagesComponent {}
