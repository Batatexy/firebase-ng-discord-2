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
  private chatID: number = 0;

  private chat?: Chat;

  constructor(private http: HttpClient, private getRouter: Router) {
    //Recebe mensagens do servidor
    this.socket.on('message', (message: Message) => {
      //com o message.userID dá pra pegar as informações que precisamos do usuário
      this.getUserByID$(message.userID).subscribe({
        next: (user) => {
          console.log(user[0]);

          if (user[0]) {
            let ul = document.querySelector('#messages') as HTMLUListElement;
            let li = document.createElement('li');
            li.innerText = `${user[0].name}: ${message.text}`;
            ul?.appendChild(li);
          }
        }
      })
    })


  }

  //Enviar mensagem para o servidor
  sendMessageToServer(text: string) {
    let message: Message = {
      chatID: this.chatID,
      userID: this.user?.id || '',
      text: text,
      edited: false,
      deleted: false,
    }

    console.log('Message:', message);

    if (message.userID != '') {

      //Trocar para postChat$
      this.postMessage$(message).subscribe({
        next: () => { },
        complete: () => { this.socket.emit('message', message); },
        error: () => { alert('Error'); }
      });

    }
  }

  public tryLogin() {
    this.authenticateLogin(localStorage.getItem('userEmail') || '0', localStorage.getItem('userPassword') || '0');
  }

  //Adicionar um amigo pela tag
  addFriend(findUserTag: string) {
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
                //Criar um novo chat, como id baseado no length do array de chats
                let chat: Chat = {
                  id: chats.length, //id do chat
                  usersIDs: [this.user?.id || '', user[0]?.id || ''],
                  messagesIDs: []
                }
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

                          },
                          error: () => { alert('Error PutUser Friend'); }
                        });
                      },
                      error: () => { alert('Error PutUser'); }
                    });
                  },
                  error: () => { alert('Error PostChat'); }
                });
              },
              error: () => { alert('Error GetChats'); }
            });
          }
          else { alert('You cannot add yourself'); }
        }
        else { alert('User not found'); }
      },
    });
  }



  //Autenticar o Login Usuário
  public authenticateLogin(typedEmail: string, typedPassword: string) {
    this.encrptText(typedEmail).then((encrptEmail) => {
      this.encrptText(typedPassword).then((encrptPassword) => {

        console.log(encrptEmail, encrptPassword);

        this.getUserByEmailAndPassword$(encrptEmail, encrptPassword).subscribe({
          next: (user) => {
            if (user[0]) {
              this.user = user[0];
              console.log('User: ', this.user);
            }
          },
          complete: () => {
            if (this.user) {
              this.getRouter.navigate(['/dashboard']);
              localStorage.setItem('userEmail', typedEmail);
              localStorage.setItem('userPassword', typedPassword);
            }
            else { this.getRouter.navigate(['/login']); }
          },
          error: () => { alert('Error GetUserByEmailAndPassword'); }
        });
      });
    });
  }



  //Autenticar o Usuário
  public authenticateRegister(typedEmail: string, typedPassword: string, typedTag: string, typedUserName: string) {
    this.encrptText(typedEmail).then((encrptEmail) => {

      this.getUserByEmail$(encrptEmail).subscribe({
        next: (user) => {
          if (user[0]) { alert('Email already registered!'); }
          else {
            this.encrptText(typedPassword).then((encrptPassword) => {

              console.log(encrptEmail, encrptPassword, typedTag, typedUserName);

              let newUser: User = {
                tag: typedTag,
                name: typedUserName,
                description: 'Hello, im new here!',
                status: 1,
                profilePicture: '',
                email: encrptEmail,
                password: encrptPassword,
                chats: []
              }

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
        error: () => { alert('Error GetUserByEmail'); }
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
    return this.http.put<unknown>(`${this.apiUrl}/users/${chat.id}`, { ...chat });
  }

  public getChatByID$(id: string): Observable<Array<Chat>> {
    return this.http.get<Array<Chat>>(`${this.apiUrl}/chats?id=${id}`);
  }

  public getChats$(): Observable<Array<Chat>> {
    return this.http.get<Array<Chat>>(`${this.apiUrl}/chats`);
  }

  public getChats(): Chat | undefined {
    return this.chat;
  }

  public setChats(chat: Chat): void {
    this.chat = chat;
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

  public setChatID(chatID: number): void {
    this.chatID = chatID;
  }

  public getChatID(): number {
    return this.chatID;
  }























}
















