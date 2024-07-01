import { Inject } from '@nestjs/common';
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { Server } from 'http';
import { Socket, Server } from 'socket.io'
import { SocketService } from './socket.service';
import { GeneralService } from 'src/shared/services/general/general.service';

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    @Inject('SOCKET-SERVICE') private readonly _socketService: SocketService,
    @Inject('GEN-SERVICE') private readonly _general: GeneralService
  ) {
    this._general.currentObj.subscribe((res) => this.objectHandler(res));
    // console.log("CONTRACTOR RUN");
  }

  private connectedClients: Map<string, Socket> = new Map();
  private rooms: { [key: string]: string[] } = {};

  objectHandler = (obj: any) => {
    const { topic, data } = JSON.parse(obj);
    console.log(topic);

    switch (topic) {
      case 'send-message-patient':
        this.sendMessageToPatient(data)
        break;

      default:
        break;
    }

  }

  afterInit(server: Server) {
    console.log('Socket Initialized');
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    console.log(`Client Disconnected: ${client.id}`);
    client.removeAllListeners(); // Clean up event listeners
    this._socketService.RemovesetSocketId(client.id)

  }

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    this.connectedClients.set(client.id, client);
    console.log(`Client Connected: ${client.id}`);
    // console.log(this.connectedClients.keys());

  }

  boardCastMsg(token: string, payload: any) {
    console.log("Socket payload ==> ", payload);
    console.log(this.wss.emit(token, payload));
  }

  @SubscribeMessage('set-socket')
  handleMessage(client: Socket, payload: any) {
    this._socketService.setSocketId(client.id, payload)
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string): void {
    let isJoined: boolean = false;
    client.rooms.forEach((ele) => {
      if (ele == room) {
        isJoined = true;
      }
    })
    if (!isJoined) {
      client.join(room);
      console.log("Join room name", room);
    }
    // console.log(this.wss.sockets.adapter.rooms);

  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    console.log("leave room name", room);
    // console.log(this.wss.sockets.adapter.rooms);
    // console.log(this.wss.sockets.);
    client.leave(room);
  }

  sendMessageToPatient(data: any) {
    console.log(data.conversation.room_name);
    this.wss.sockets.adapter.rooms.get(data.conversation.room_name).forEach((ele) => {
      const client = this.connectedClients.get(ele);
      if (client) {
        const rooms = Array.from(client.rooms).filter(room => room !== client.id); // Get rooms excluding personal room
        rooms.forEach(room => {
          this.wss.to(room).emit('chat-message', data);
        });
      }
    });
    // this.wss.sockets.in(data.conversation.room_name).emit('chat-message', data)
    // this.wss.to(data.conversation.room_name).emit('chat-message', data)
  }

}
