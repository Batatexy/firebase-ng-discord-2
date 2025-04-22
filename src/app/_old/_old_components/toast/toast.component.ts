import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CloseButtonComponent } from '../close-button/close-button.component';

@Component({
  selector: 'app-toast',
  imports: [CommonModule, CloseButtonComponent],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  @Input() show?: boolean;
  @Input() reviewStatus?: string;

  @Output() eventEmitterShowStatus: EventEmitter<boolean> = new EventEmitter();

  public sendShowStatus() {
    if (this.show == true) this.show = false;
    this.eventEmitterShowStatus.emit(this.show);
  }
}
