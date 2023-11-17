
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
  }
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
  onNewMessage(@MessageBody() body: GustData) {
    console.log(body);
    this.server.emit('get_message', {
     data: body
    });
    
  }
}
