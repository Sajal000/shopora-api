import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from '../schemas/message.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
  ) {}

  async createMessage(senderId: string, receiverId: string, content: string) {
    const newMessage = new this.messageModel({ senderId, receiverId, content });
    return await newMessage.save();
  }

  async getMessages(senderId: string, receiverId: string) {
    return await this.messageModel
      .find({
        $or: [
          {
            senderId: new Types.ObjectId(senderId),
            receiverId: new Types.ObjectId(receiverId),
          },
          {
            senderId: new Types.ObjectId(receiverId),
            receiverId: new Types.ObjectId(senderId),
          },
        ],
      })
      .sort({ createdAt: 1 })
      .lean();
  }
}
