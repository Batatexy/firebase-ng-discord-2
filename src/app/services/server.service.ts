import { Injectable } from '@angular/core';
import { WebSocketServer } from 'ws';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  wss: WebSocketServer = new WebSocketServer({ port: environment.port });

  constructor() {

    this.wss.on('connection', (ws) => {
      ws.on('message', (data) => {
        console.log('Received message from client: ', data);

      });

      ws.send('Hello, this is server.ts');
    });

    console.log('Listening at port: ', environment.port);

  }




};
