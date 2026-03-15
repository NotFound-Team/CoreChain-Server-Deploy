import { JwtService } from '@nestjs/jwt';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { WsService } from 'src/ws/ws.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConversationItem } from './declarations/conversationItem';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
export declare class ChatService {
    private conversationRepository;
    private messageRepository;
    private readonly wsService;
    private readonly jwtService;
    private readonly configService;
    constructor(conversationRepository: Repository<Conversation>, messageRepository: Repository<Message>, wsService: WsService, jwtService: JwtService, configService: ConfigService);
    private server;
    private clients;
    setServer(server: Server): void;
    registerClient(client: Socket): Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
    removeClient(client: Socket): void;
    emitToClient(clientId: string, event: string, data: any): void;
    joinRoom(client: Socket, room: string): void;
    leaveRoom(client: Socket, room: string): void;
    broadcastToRoom(room: string, event: string, data: any): void;
    create(createConversationDto: CreateConversationDto): Promise<Conversation[]>;
    getOrCreateDirectConversation({ userId, otherId, }: {
        userId: string;
        otherId: string;
    }): Promise<Conversation>;
    getConversationById({ conversationId }: {
        conversationId: string;
    }): Promise<Conversation>;
    getRecentConversations({ userId, lastConversationId, }: {
        userId: string;
        lastConversationId?: string;
    }): Promise<ConversationItem[]>;
    createMessage(createMessageDto: CreateMessageDto): Promise<Message>;
    getMessages({ conversationId, lastMessageId, }: {
        conversationId: string;
        lastMessageId?: string;
    }): Promise<Message[]>;
    findAll(): string;
    findOne(id: number): string;
    remove(id: number): string;
}
