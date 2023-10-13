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
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';

  @WebSocketGateway()
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    users: number = 0;


    private logger: Logger = new Logger('ChatGateway')

    afterConnection(sever:any){
        this?.logger.log('Initialized')
    }

  
    async handleConnection() {
      // A client has connected
      this.users++;
  
      // Notify connected clients of current users
      this.server.emit('message', `Users ${this.users} connected.`);
    }
  
    async handleDisconnect() {
      // A client has disconnected
      this.users--;
  
      // Notify connected clients of current users
      this.server.emit('message', `Users ${this.users} disconnected.`);
    }
  
    @SubscribeMessage('chat')
    async onChat(client: Socket, message: string) {
      client.broadcast.emit('message', `chat: ${message}`);
    //   return message
    }

  }