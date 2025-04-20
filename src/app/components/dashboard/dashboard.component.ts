import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment.development';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  message: string = '';

  constructor(private getClientService: ClientService) { }


  ngOnInit() {

  }

  sendMessage() {
    this.getClientService.sendMessageToServer(this.message);
    this.message = '';
  }

}
