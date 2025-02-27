import { Component } from '@angular/core';

@Component({
  selector: 'app-documents',
  template: `
    <div>
      <h1>Documents</h1>
      <p>Welcome to the Documents section!</p>
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
export class DocumentsComponent {}
