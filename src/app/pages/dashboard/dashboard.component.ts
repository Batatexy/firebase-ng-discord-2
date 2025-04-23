import { Component } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  message: string = '';
  findUserTag: string = '';

  constructor(private getClientService: ClientService, private getActivatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getClientService.tryLogin();
    this.getClientService.setChatID(Number(this.getActivatedRoute.snapshot.paramMap.get("chatID")));
    console.log(this.getClientService.getChatID());

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
