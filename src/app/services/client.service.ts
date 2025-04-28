import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Chat } from '../models/chat';


@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private socket = io('ws://localhost:8080');
  private apiUrl = 'http://localhost:3000';

  //Usuário logado, chat de conversa e lista de amigos
  private user?: User;
  private chatID: string = '0';
  private friendsList: Array<{ chat: Chat, user: User; }> = [];

  constructor(private http: HttpClient, private getRouter: Router, private getActivatedRoute: ActivatedRoute) {
    //Recebe mensagens do servidor
    this.socket.on('message', (message: Message) => {
      //com o message.userID dá pra pegar as informações que precisamos do usuário

      //Atualizar a tela com a mensagem recebida, se bater o id do chat
      if (message.chatID == this.chatID) {
        //Busca o usuário pelo id
        this.getUserByID$(message.userID).subscribe({
          next: (user) => {
            console.log(user[0]);

            if (user[0]) {
              this.friendsList.forEach(friend => {
                if (friend.chat.id == message.chatID) {

                  //Procurar qual chat adicionar a mensagem
                  this.friendsList.forEach((friend) => {
                    if (friend.chat.id == message.chatID) {
                      friend.chat.messages.push(message);

                      //Editar no banco o chat especifico com a nova mensagem implementada
                      this.putChat$(friend.chat).subscribe({
                        error: () => { alert('Erro: PutChat'); }
                      });

                    }
                  });
                }
              });
            }
          }
        });
      }

    });

    this.socket.on('friendRequest', (friend: { chat: Chat, user: User; }) => {

      console.log(friend.user.id, this.user?.id);

      if (friend.user.id == this.user?.id) {
        this.user?.chats.push(friend.chat.id);
        this.refreshFriendsList();
      }


    });
  }

  //Enviar mensagem para o servidor
  sendMessageToServer(text: string) {
    if (this.chatID.toLowerCase() != '') {
      //Criar um "Pacote", um objeto que carrega a mensagem digitada com mais algumas informações
      let message: Message = {
        chatID: this.chatID,
        userID: this.user?.id.toLowerCase() || '',
        text: text,
        edited: false,
        deleted: false,
        //data: new Date(),
        //time: new Date().toLocaleTimeString()
      };

      this.socket.emit('message', message);
    }
  }



  //Adicionar um amigo pela tag
  addFriend(findUserTag: string) {
    //Verificar se não é o mesmo usuário
    if (findUserTag.toLowerCase() == this.user?.id.toLowerCase()) {
      alert('Você não pode se adicionar!');
      return;
    }

    //Verificar se o usuario já está adicionado
    let friendOnList = false;

    this.friendsList.forEach((friend) => {
      friend.chat.usersIDs.forEach(userID => {
        if (userID.toLowerCase() === findUserTag.toLowerCase()) {
          console.log('IDs: ' + userID.toLowerCase(), findUserTag.toLowerCase());
          friendOnList = true;
        }
      });

    });

    if (friendOnList) {
      alert('Usuário já está na sua lista de amigos!');
      return;
    }

    //Procurar se este amigo existe
    this.getUserByID$(findUserTag.toLowerCase()).subscribe({
      next: (user) => {
        //Caso exista
        if (user[0]) {
          //Pegar todos os chats(infelizmente não tem como pegar só o length)
          this.getChats$().subscribe({
            next: (allChats) => {
              //Criar um novo chat, como id baseado no length do array de chats + 1
              let chat: Chat = {
                id: String(allChats.length + 1), //id do chat
                usersIDs: [this.user?.id.toLowerCase() || '', user[0]?.id.toLowerCase() || ''],
                messages: []
              };
              //Adicionar o chat no banco de dados
              this.postChat$(chat).subscribe({
                complete: () => {
                  //Adicionar o ID do chat no usuário logado
                  this.user?.chats.push(chat.id);
                  this.putUser$(this.user).subscribe({
                    complete: () => {
                      //Adicionar o ID do chat no amigo
                      user[0].chats.push(chat.id);


                      this.putUser$(user[0]).subscribe({
                        complete: () => {
                          this.socket.emit('friendRequest', { chat: chat, user: user[0] });
                          this.refreshFriendsList();
                        },
                        error: () => { alert('Erro: PutUser Friend'); }
                      });
                    },
                    error: () => { alert('Erro: PutUser'); }
                  });
                },
                error: () => { alert('Erro: PostChat'); }
              });
            },
            error: () => { alert('Erro: GetChats'); }
          });

        }
        else { alert('Usuário não encontrado!'); }
      },
    });
  }



  public tryLogin() {
    this.authenticateLogin(localStorage.getItem('userEmail') || '0', localStorage.getItem('userPassword') || '0');
  }

  //Autenticar o Login Usuário
  public authenticateLogin(email: string, password: string) {
    //Criptografar a entrada, sendo do local storage ou da tela de login / registro
    this.encryptText(email).then((encryptedEmail) => {
      this.encryptText(password).then((encryptedPassword) => {

        console.log(encryptedEmail, encryptedPassword);

        //Para então comparar com o email e senha salvos no banco(criptografados)
        this.getUserByEmailAndPassword$(encryptedEmail, encryptedPassword).subscribe({
          next: (user) => {
            if (user[0]) {
              //Se digitado corretamente, usuário logado, salvo no sistema
              this.user = user[0];

              if (this.user) {
                //Então se é salvo o que foi digitado no local storage
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userPassword', password);

                //Validar se estamos em algum chat
                let validation = false;

                this.user.chats.forEach(chatID => {
                  if (this.chatID == chatID) {
                    validation = true;
                  }
                });

                //Caso contrario, retornar ao dashboard
                if (this.chatID == '0' || !validation) {
                  this.getRouter.navigate(['/dashboard']);
                }
              }
            }
          },
          complete: () => {
            if (this.user) {
              //Puxar informações: Chats, Amigos
              this.refreshFriendsList();
            }
            else { this.getRouter.navigate(['/login']); }
          },
          error: () => { alert('Erro: GetUserByEmailAndPassword'); }
        });
      });
    });
  }

  public refreshFriendsList() {

    this.friendsList = [];

    this.user?.chats.forEach(chatID => {
      this.getChatByID$(chatID).subscribe({
        next: (chat) => {
          chat[0].usersIDs.forEach(userID => {
            if (userID != this.user?.id) {
              this.getUserByID$(userID).subscribe({
                next: (user) => {

                  let friendOnList = false;
                  let newFriend = { chat: chat[0], user: user[0] };

                  this.friendsList.forEach(friend => {
                    if ((newFriend.chat.id == friend.chat.id) && (newFriend.user.id == friend.user.id)) {
                      friendOnList = true;
                    }
                  });

                  if (!friendOnList) {
                    this.addToFriendList(newFriend);
                  }

                }
              });
            }
          });
        }
      });
    });



  }

  //Autenticar o Usuário
  public authenticateRegister(typedEmail: string, typedPassword: string, typedTag: string, typedUserName: string) {
    this.encryptText(typedEmail).then((encryptedEmail) => {

      this.getUserByEmail$(encryptedEmail).subscribe({
        next: (user) => {
          if (user[0]) { alert('Este Email já está cadastrado!'); }
          else {
            this.encryptText(typedPassword).then((encryptedPassword) => {

              console.log(encryptedEmail, encryptedPassword, typedTag, typedUserName);

              let newUser: User = {
                id: typedTag.toLowerCase(),
                name: typedUserName,
                description: 'Hello, im new here!',
                status: 1,
                profilePicture: '../../../assets/images/profile.png',
                email: encryptedEmail,
                password: encryptedPassword,
                chats: []
              };

              this.postUser$(newUser).subscribe({
                complete: () => {
                  localStorage.setItem('userEmail', typedEmail);
                  localStorage.setItem('userPassword', typedPassword);
                  this.getRouter.navigate(['/dashboard']);
                }
              });
            });

          }
        },
        complete: () => { },
        error: () => { alert('Erro: GetUserByEmail'); }
      });


    });
  }

  public logOut() {
    localStorage.setItem('userEmail', '');
    localStorage.setItem('userPassword', '');
    this.user = undefined;
    this.tryLogin();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  public async encryptText(text: string | null): Promise<string> {
    if (!text) return '';
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  //Pegar o usuario no banco de dados
  //Adicionar
  public postUser$(user: User): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/users`, { ...user });
  }

  //Editar
  public putUser$(user: User | undefined): Observable<unknown> {
    if (!user) return new Observable<unknown>();
    return this.http.put<unknown>(`${this.apiUrl}/users/${user.id}`, { ...user });
  }

  public getUserByID$(id: string): Observable<Array<User>> {
    return this.http.get<Array<User>>(`${this.apiUrl}/users?id=${id}`);
  }

  public getUserByEmailAndPassword$(email: string, password: string): Observable<Array<User>> {
    return this.http.get<Array<User>>(`${this.apiUrl}/users?email=${email}&password=${password}`);
  }

  public getUserByEmail$(email: string): Observable<Array<User>> {
    return this.http.get<Array<User>>(`${this.apiUrl}/users?email=${email}`);
  }

  //Usuario salvo 
  public getUser(): User | undefined {
    return this.user;
  }

  public setUser(user: User): void {
    this.user = user;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  //Pegar o usuario no banco de dados
  //Adicionar
  public postChat$(chat: Chat): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/chats`, { ...chat });
  }

  //Editar
  public putChat$(chat: Chat): Observable<unknown> {
    return this.http.put<unknown>(`${this.apiUrl}/chats/${chat.id}`, { ...chat });
  }

  public getChatByID$(id: string): Observable<Array<Chat>> {
    return this.http.get<Array<Chat>>(`${this.apiUrl}/chats?id=${id}`);
  }

  public getChats$(): Observable<Array<Chat>> {
    return this.http.get<Array<Chat>>(`${this.apiUrl}/chats`);
  }



  public getFriendsList(): Array<{ chat: Chat, user: User; }> {
    return this.friendsList;
  }

  public setFriendsList(friendsList: Array<{ chat: Chat, user: User; }>): void {
    this.friendsList = friendsList;
  }

  public addToFriendList(friend: { chat: Chat, user: User; }): void {
    this.friendsList.push(friend);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  //Pegar o usuario no banco de dados
  //Adicionar
  public postMessage$(message: Message): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/messages`, { ...message });
  }

  //Editar
  public putMessage$(message: Message): Observable<unknown> {
    return this.http.put<unknown>(`${this.apiUrl}/messages/${message.id}`, { ...message });
  }

  public getMessageByID$(id: string): Observable<Array<Message>> {
    return this.http.get<Array<Message>>(`${this.apiUrl}/messages?id=${id}`);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  public setChatID(chatID: string): void {
    this.chatID = chatID;
  }

  public getChatID(): string {
    return this.chatID;
  }












  getThisRouter() {
    return this.getRouter;
  }







}
















