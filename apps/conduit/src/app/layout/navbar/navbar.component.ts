import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { User } from '../../shared/shared.models';

@Component({
  selector: 'conduit-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  @Input() user: User;
  @Input() isLoggedIn: boolean;
  @Output() onLogout = new EventEmitter();

  logout() {
    this.onLogout.emit();
  }
}
