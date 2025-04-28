import { Component, Input } from '@angular/core';
import { User } from '../../models/user';
import { Message } from '../../models/message';

@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  @Input() user?: User;
  @Input() message?: Message;
  @Input() right?: string;

}
