import { Injectable } from '@angular/core';
import { Socket } from '../models/socket';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  //Importa o express
  http = require('http').createServer();

  //Importa o socket.io
  io = require('socket.io')(this.http, {
    cors: {
      origin: '*',
    },
  });

  constructor() {
    //Recebe a conexão do cliente
    this.io.on('connection', (socket: Socket) => {
      console.log('New client connected');

      //Recebe a mensagem do cliente
      socket.on('message', (message: Message) => {
        console.log(message.userID, message.text);

        //Envia a mensagem para todos os clientes conectados
        //Não consegui fazer mandar o socket (Caso precise)
        this.io.emit('message', message);
      });
    })

    this.http.listen(8080, () => {
      console.log('Server is listening on port 8080');
    });
  }







}
