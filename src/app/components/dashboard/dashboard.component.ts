import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestesService } from '../../services/testes.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  ws = new WebSocket('ws://localhost:' + environment.port);
  message: string = "";

  constructor() {

  }

  ngOnInit() {
    this.ws.addEventListener('open', () => {
      console.log('WebSocket connection opened');
    });
  }

  sendMessage() {
    this.ws.send(this.message);
    this.message = "";
  }

}
