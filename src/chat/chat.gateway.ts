// import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway()
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

//   @WebSocketServer() server: Server;

//  async handleConnection(client: Socket) {
//     console.log(`Client connected: ${client.id}`);
//     this.server.emit('message', `User ${client.id} connected.`);
//   }

//   handleDisconnect(client: Socket) {
//     console.log(`Client disconnected: ${client.id}`);
//     this.server.emit('message', `User ${client.id} disconnected.`);
//   }

//   handleMessage(client: Socket, message: string) {
//     this.server.emit('message', `User ${client.id}: ${message}`);
//   }
// }

import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Client Connection
  async handleConnection(client: Socket) {
    console.log(`client id: ${client?.id}`);
    this.server.emit('message', `User ${client.id} connected.`);
    console.log('connected');
  }

  // Client Disconnection
  handleDisconnect(client: Socket) {
    console.log(`client id: ${client.id}`);
    this.server.emit('message', `User ${client.id} disconnected.`);
    console.log('disconnected');
  }

  // Chat Messgaes
  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.emit('new_notification', {
     data:{
      type: 'Sign In',
      uniqueId: '15d86ff1-94ec-468b-9e47-3f4e666cc876',
      name: 'John Doe',
      time: '1:20 pm',
     }
    });
    
  }
}
