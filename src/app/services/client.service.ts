import { Injectable } from '@angular/core';
import { WebSocket } from 'ws';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class ClientService {
  ws = new WebSocket('ws://localhost:' + environment.port);

  constructor() {
    this.ws.on('open', () => {
      console.log('[Client] Connected to server');
      this.ws.send('First Message');


    });

    this.ws.on('message', (data) => {
      console.log('[Client] Received message from server: ', data);


    });

    this.ws.on('close', () => {
      console.log('[Client] Disconnected from server');


    });
  }

}
