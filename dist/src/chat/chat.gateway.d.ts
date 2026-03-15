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
    create(createConversationDto: CreateConversationDto): Promise<import("./entities/conversation.entity").Conversation[]>;
    getById(data: {
        conversationId: string;
    }): Promise<import("./entities/conversation.entity").Conversation>;
    getByUserIdAndOtherId(data: {
        userId: string;
        otherId: string;
    }): Promise<import("./entities/conversation.entity").Conversation>;
    getRecentConversations(data: {
        userId: string;
        lastConversationId?: string;
    }): Promise<import("./declarations/conversationItem").ConversationItem[]>;
    sendMessage(createMessageDto: CreateMessageDto): Promise<import("./entities/message.entity").Message>;
    getMessage(data: {
        conversationId: string;
        lastMessage?: string;
    }): Promise<import("./entities/message.entity").Message[]>;
    findAll(): string;
    findOne(id: number): string;
    remove(id: number): string;
}
