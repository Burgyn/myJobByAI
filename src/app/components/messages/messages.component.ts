import { Component } from '@angular/core';

@Component({
  selector: 'app-messages',
  template: `
    <div>
      <h1>Messages</h1>
      <p>Welcome to the Messages section!</p>
    </div>
  `,
  styles: [`
    div {
      text-align: center;
      padding: 20px;
    }
    h1 {
      font-size: 24px;
      color: #333;
    }
    p {
      font-size: 16px;
      color: #666;
    }
  `]
})
export class MessagesComponent {}
