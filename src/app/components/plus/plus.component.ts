import { Component } from '@angular/core';

@Component({
  selector: 'app-plus',
  template: `
    <button class="plus-button">+</button>
  `,
  styles: [`
    .plus-button {
      font-size: 2rem;
      color: var(--bright-blue);
      background: none;
      border: none;
      cursor: pointer;
    }
  `]
})
export class PlusComponent {}
