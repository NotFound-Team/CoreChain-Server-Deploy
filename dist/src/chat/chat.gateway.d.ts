import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    constructor(chatService: ChatService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    create(createConversationDto: CreateConversationDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/conversation.schema").Conversation> & import("./schemas/conversation.schema").Conversation & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/conversation.schema").Conversation> & import("./schemas/conversation.schema").Conversation & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getById(data: {
        conversationId: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/conversation.schema").Conversation> & import("./schemas/conversation.schema").Conversation & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/conversation.schema").Conversation> & import("./schemas/conversation.schema").Conversation & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getByUserIdAndOtherId(data: {
        userId: string;
        otherId: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/conversation.schema").Conversation> & import("./schemas/conversation.schema").Conversation & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/conversation.schema").Conversation> & import("./schemas/conversation.schema").Conversation & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getRecentConversations(data: {
        userId: string;
        lastConversationId?: string;
    }): Promise<import("./declarations/conversationItem").ConversationItem[]>;
    sendMessage(createMessageDto: CreateMessageDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/message.schema").Message> & import("./schemas/message.schema").Message & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/message.schema").Message> & import("./schemas/message.schema").Message & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getMessage(data: {
        conversationId: string;
        lastMessage?: string;
    }): Promise<import("./schemas/message.schema").Message[]>;
    findAll(): string;
    findOne(id: number): string;
    remove(id: number): string;
}
