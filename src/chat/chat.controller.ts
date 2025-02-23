import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChatService } from './providers/chat.service';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enum/auth-type.enum';

@Controller('chat')
@ApiTags('Chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   *
   * @param senderId
   * @param receiverId
   * @returns
   */
  @ApiOperation({ summary: 'Fetch chat history' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched chat history',
  })
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @Get('history/:senderId/:receiverId')
  async getChatHistory(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ) {
    return this.chatService.getMessages(senderId, receiverId);
  }
}
