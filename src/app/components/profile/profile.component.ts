import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  template: `
    <div>
      <h1>Profile</h1>
      <p>Welcome to the Profile section!</p>
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
export class ProfileComponent {}
