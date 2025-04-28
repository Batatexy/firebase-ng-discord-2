import { Component } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user';
import { MessageComponent } from '../../components/message/message.component';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, MessageComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  message: string = '';
  findUserTag: string = '';

  constructor(private getClientService: ClientService, private getActivatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getClientService.tryLogin();
  }

  public sendMessage() {
    if (this.message != '') {
      console.log('user:', this.getClientService.getUser());
      this.getClientService.sendMessageToServer(this.message);
      this.message = '';
    }
  }

  public sendUserTag() {
    if (this.findUserTag != '') {
      this.getClientService.addFriend(this.findUserTag);
      this.findUserTag = '';
    }
  }

  public getUser() {
    return this.getClientService.getUser();
  }

  public getChats() {
    return this.getClientService.getChats();
  }

  public getChatID() {
    return this.getClientService.getChatID();
  }


  public goToChat(chatID: string) {
    this.getClientService.setChatID(chatID);
    this.getClientService.getThisRouter().navigate(['/dashboard/' + chatID]);
  }

}
