import { User } from '../../users/entities/user.entity';
import { Conversation } from './conversation.entity';
export declare class Message {
    _id: string;
    conversation: Conversation;
    conversationId: string;
    sender: User;
    senderId: string;
    content: string;
    attachments: string[];
    readBy: {
        _id: string;
        name: string;
        avt: string;
    }[];
    createdAt: Date;
    isDeleted: boolean;
}
