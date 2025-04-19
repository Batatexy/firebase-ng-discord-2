import { Injectable } from '@angular/core';
import { WebSocket } from 'ws';
import io from 'socket.io-client';
import { environment } from '../../environments/environment.development';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})

export class ClientService {
  socket = io('ws://localhost:8080');

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
      userID: 1,
      text: text,
    }
    this.socket.emit('message', message);
  }

}


