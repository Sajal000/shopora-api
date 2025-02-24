import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './providers/chat.service';
import { ChatDto } from './dto/chat.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private users = new Map<string, string>();

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.users.forEach((value, key) => {
      if (value === client.id) {
        this.users.delete(key);
      }
    });
  }

  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.users.set(userId, client.id);
  }

  @SubscribeMessage('send_message')
  async handleMessage(@MessageBody() data: ChatDto) {
    const { senderId, receiverId, content } = data;
    const message = await this.chatService.createMessage(
      senderId,
      receiverId,
      content,
    );

    const receiverSocketId = this.users.get(receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receive_message', message);
    }
    return message;
  }
}
