import { Component } from '@angular/core';

@Component({
  selector: 'xstate-angular-lifetime',
  templateUrl: './lifetime.component.html',
  styleUrls: ['./lifetime.component.scss'],
})
export class LifetimeComponent {
  isComponentAVisible: boolean;
  toggleComponentA() {
    this.isComponentAVisible = !this.isComponentAVisible;
  }
}
