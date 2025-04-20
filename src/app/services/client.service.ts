import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Message } from '../models/message';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class ClientService {
  private socket = io('ws://localhost:8080');

  constructor() {
    //Recebe mensagens do servidor
    this.socket.on('message', (message: Message) => {
      //com o message.userID dá pra pegar as informações que precisamos do usuário

      console.log(message);

      const ul = document.querySelector('ul');
      const li = document.createElement('li');

      li.innerText = message.userID + ': ' + message.text;
      ul?.appendChild(li);
    })


  }

  //Enviar mensagem para o servidor
  sendMessageToServer(text: string) {
    const message: Message = {
      messageID: '',
      userID: 1,
      text: text,
    }
    this.socket.emit('message', message);
  }



















}


