import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Chat } from '../models/chat';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private socket = io('ws://localhost:8080');
  private apiUrl = 'http://localhost:3000';
  private user?: User;
  private chatID: string = '0';
  private chats: Array<Chat> = [];
  private friendsList: Array<User> = [];

  constructor(private http: HttpClient, private getRouter: Router) {
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
              //Criar um elemento li e adicionar na lista de mensagens
              let ul = document.querySelector('#messages') as HTMLUListElement;
              let li = document.createElement('li');
              li.innerText = `${user[0].name}: ${message.text}`;
              ul?.appendChild(li);
            }
          }
        });
      }


    });


  }

  //Enviar mensagem para o servidor
  sendMessageToServer(text: string) {
    let message: Message = {
      chatID: this.chatID,
      userID: this.user?.id || '',
      text: text,
      edited: false,
      deleted: false,
      //data: new Date(),
      //time: new Date().toLocaleTimeString()
    };

    console.log('Message:', message);

    if (message.userID != '') {

      this.chats.forEach((chat) => {
        if (chat.id == message.chatID) {

          //????????????????????????????????
          let updateChat: Chat = chat;
          updateChat.messages.push(message);

          this.putChat$(updateChat).subscribe({
            next: () => { },
            complete: () => { this.socket.emit('message', message); },
            error: () => { alert('Erro: PutChat'); }
          });

        }
      }
      );


    }
  }

  public tryLogin() {
    this.authenticateLogin(localStorage.getItem('userEmail') || '0', localStorage.getItem('userPassword') || '0');
  }

  //Adicionar um amigo pela tag
  addFriend(findUserTag: string) {

    let validation = false;

    console.log(this.chats);

    this.chats.forEach((chat) => {
      console.log(chat);

      chat.usersIDs.forEach(userID => {
        if (userID === findUserTag) {
          console.log(userID, findUserTag);
          validation = true;
        }
      });
    });

    console.log(validation);

    if (!validation) {
      //Procurar se este amigo existe
      this.getUserByTag$(findUserTag).subscribe({
        next: (user) => {
          //Caso exista
          if (user[0]) {
            console.log(user[0]);
            //Verificar se não é o mesmo usuário
            if (user[0].id != this.user?.id) {
              //Pegar todos os chats(infelizmente não tem como pegar só o length)
              this.getChats$().subscribe({
                next: (chats) => {
                  //Criar um novo chat, como id baseado no length do array de chats + 1
                  let chat: Chat = {
                    id: String(chats.length + 1), //id do chat
                    usersIDs: [this.user?.id || '', user[0]?.id || ''],
                    messages: []
                  };
                  //Adicionar o chat no banco de dados
                  this.postChat$(chat).subscribe({
                    complete: () => {
                      //Adicionar o chat no usuário logado
                      this.user?.chats.push(chat.id);
                      this.putUser$(this.user).subscribe({
                        complete: () => {
                          //Adicionar o chat no amigo
                          user[0].chats.push(chat.id);
                          this.putUser$(user[0]).subscribe({
                            complete: () => {
                              //this.tryLogin();
                              this.chats.push(chat);

                              this.getUserByID$(findUserTag).subscribe({
                                next: (user) => {
                                  this.friendsList.push(user[0]);
                                }
                              });





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
            else { alert('Você não pode se adicionar kk'); }
          }
          else { alert('Usuário não encontrado!'); }
        },
      });
    }
    else {
      alert('Usuário já está na sua lista de amigos!');
    }
  }



  //Autenticar o Login Usuário
  public authenticateLogin(typedEmail: string, typedPassword: string) {
    //Criptografar a entrada, sendo do local storage ou da tela de login / registro
    this.encrptText(typedEmail).then((encrptEmail) => {
      this.encrptText(typedPassword).then((encrptPassword) => {

        console.log(encrptEmail, encrptPassword);

        //Para então comparar com o email e senha salvos no banco(criptografados)
        this.getUserByEmailAndPassword$(encrptEmail, encrptPassword).subscribe({
          next: (user) => {
            if (user[0]) {
              //Se digitado corretamente, usuário logado, salvo no sistema
              this.user = user[0];
            }
          },
          complete: () => {
            if (this.user) {
              //Então se é salvo o que foi digitado no local storage
              localStorage.setItem('userEmail', typedEmail);
              localStorage.setItem('userPassword', typedPassword);

              //Validar chat correto
              let validation = false;

              this.user.chats.forEach(chatID => {
                if (this.chatID == chatID) {
                  validation = true;
                }
              });

              if (this.chatID == '0' || !validation) {
                this.getRouter.navigate(['/dashboard']);
              }
            }
            else { this.getRouter.navigate(['/login']); }
          },
          error: () => { alert('Erro: GetUserByEmailAndPassword'); }
        });
      });
    });
  }



  //Autenticar o Usuário
  public authenticateRegister(typedEmail: string, typedPassword: string, typedTag: string, typedUserName: string) {
    this.encrptText(typedEmail).then((encrptEmail) => {

      this.getUserByEmail$(encrptEmail).subscribe({
        next: (user) => {
          if (user[0]) { alert('Este Email já está cadastrado!'); }
          else {
            this.encrptText(typedPassword).then((encrptPassword) => {

              console.log(encrptEmail, encrptPassword, typedTag, typedUserName);

              let newUser: User = {
                id: typedTag,
                name: typedUserName,
                description: 'Hello, im new here!',
                status: 1,
                profilePicture: '',
                email: encrptEmail,
                password: encrptPassword,
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



  public async encrptText(text: string | null): Promise<string> {
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

  public getUserByTag$(tag: string): Observable<Array<User>> {
    return this.http.get<Array<User>>(`${this.apiUrl}/users?tag=${tag}`);
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



  public getChats(): Array<Chat> {
    return this.chats;
  }

  public setChats(chats: Array<Chat>): void {
    this.chats = chats;
  }

  public addChat(chat: Chat): void {
    this.chats.push(chat);
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






  public getFriendsList(): Array<User> {
    return this.friendsList;
  }

  public setFriendsList(friendsList: Array<User>): void {
    this.friendsList = friendsList;
  }

  public addFriendToList(user: User): void {
    this.friendsList.push(user);
  }








  getThisRouter() {
    return this.getRouter;
  }







}
















