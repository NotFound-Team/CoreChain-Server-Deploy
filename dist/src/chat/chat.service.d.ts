import { JwtService } from '@nestjs/jwt';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { WsService } from 'src/ws/ws.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConversationItem } from './declarations/conversationItem';
import { Types } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
export declare class ChatService {
    private conversationModel;
    private messageModel;
    private readonly wsService;
    private readonly jwtService;
    private readonly configService;
    constructor(conversationModel: SoftDeleteModel<ConversationDocument>, messageModel: SoftDeleteModel<MessageDocument>, wsService: WsService, jwtService: JwtService, configService: ConfigService);
    private server;
    private clients;
    setServer(server: Server): void;
    registerClient(client: Socket): Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
    removeClient(client: Socket): void;
    emitToClient(clientId: string, event: string, data: any): void;
    joinRoom(client: Socket, room: string): void;
    leaveRoom(client: Socket, room: string): void;
    broadcastToRoom(room: string, event: string, data: any): void;
    create(createConversationDto: CreateConversationDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Conversation> & Conversation & {
        _id: Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Conversation> & Conversation & {
        _id: Types.ObjectId;
    }>;
    getOrCreateDirectConversation({ userId, otherId, }: {
        userId: string;
        otherId: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Conversation> & Conversation & {
        _id: Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Conversation> & Conversation & {
        _id: Types.ObjectId;
    }>;
    getConversationById({ conversationId }: {
        conversationId: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Conversation> & Conversation & {
        _id: Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Conversation> & Conversation & {
        _id: Types.ObjectId;
    }>;
    getRecentConversations({ userId, lastConversationId, }: {
        userId: string;
        lastConversationId?: string;
    }): Promise<ConversationItem[]>;
    createMessage(createMessageDto: CreateMessageDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Message> & Message & {
        _id: Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Message> & Message & {
        _id: Types.ObjectId;
    }>;
    getMessages({ conversationId, lastMessageId, }: {
        conversationId: string;
        lastMessageId?: string;
    }): Promise<Message[]>;
    findAll(): string;
    findOne(id: number): string;
    remove(id: number): string;
}
