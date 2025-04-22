import { Component } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  message: string = '';
  findUserTag: string = '';

  constructor(private getClientService: ClientService) { }

  ngOnInit() {
    this.getClientService.tryLogin();
  }

  sendMessage() {
    if (this.message != '') {
      console.log('user:', this.getClientService.getUser());
      this.getClientService.sendMessageToServer(this.message);
      this.message = '';
    }
  }

  sendUserTag() {
    if (this.findUserTag != '') {
      this.getClientService.addFriend(this.findUserTag);
      this.findUserTag = '';
    }
  }


  getUser() {
    return this.getClientService.getUser();
  }







}
