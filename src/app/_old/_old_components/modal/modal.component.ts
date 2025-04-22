import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CloseButtonComponent } from '../close-button/close-button.component';

@Component({
  selector: 'app-modal',
  imports: [TranslatePipe, CloseButtonComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() id?: string;
}
