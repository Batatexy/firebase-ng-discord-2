import { Component } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  message: string = '';
  findUserTag: string = '';
  loadChats: boolean = false;


  constructor(private getClientService: ClientService, private getActivatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.getClientService.tryLogin();
    this.getClientService.setChatID(String(this.getActivatedRoute.snapshot.paramMap.get("chatID")));

    this.getClientService.setFriendsList([]);
    this.getClientService.setChats([]);

    console.log(typeof (this.getClientService.getChatID()), this.getClientService.getChatID());
  }

  ngAfterViewChecked() {


    if (this.getClientService.getUser() != null && !this.loadChats) {
      console.log('User: ', this.getClientService.getUser());
      this.loadChats = true;

      this.getClientService.getUser()?.chats.forEach((chatID) => {
        this.getClientService.getChatByID$(chatID).subscribe({
          next: (chat) => {
            this.getClientService.addChat(chat[0]);
            console.log('Chat loaded:', chat[0]);

            chat[0].usersIDs.forEach(userID => {

              if (userID != this.getClientService.getUser()?.id)

                this.getClientService.getUserByID$(userID).subscribe({
                  next: (user) => {
                    this.getClientService.addFriendToList(user[0]);
                  },
                });


            });


          }
        });
      });
    }
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

  public getFriendsList() {
    return this.getClientService.getFriendsList();
  }

  public goToChat(chatID: string) {
    this.getClientService.getThisRouter().navigate(['/dashboard/' + chatID]);
  }

}
