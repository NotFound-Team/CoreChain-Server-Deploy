"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const conversation_entity_1 = require("./entities/conversation.entity");
const message_entity_1 = require("./entities/message.entity");
const ws_service_1 = require("../ws/ws.service");
const config_1 = require("@nestjs/config");
const CHAT_NAME_SPACE = '/chat';
let ChatService = class ChatService {
    constructor(conversationRepository, messageRepository, wsService, jwtService, configService) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.wsService = wsService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.clients = new Map();
    }
    setServer(server) {
        this.server = server;
    }
    registerClient(client) {
        const token = client.handshake.auth?.token ||
            client.handshake.headers?.authorization?.split(' ')[1];
        if (!token) {
            console.log('Missing token. Disconnecting client:', client.id);
            return client.disconnect();
        }
        try {
            const secret = this.configService.get('JWT_ACCESS_TOKEN_SECRET');
            const payload = this.jwtService.verify(token, {
                secret,
                ignoreExpiration: false,
            });
            client['user'] = payload;
            console.log('Client authenticated:', client.id);
            this.clients.set(payload._id.toString(), client);
        }
        catch (error) {
            console.log('Invalid token. Disconnecting client:', client.id);
            return client.disconnect();
        }
    }
    removeClient(client) { }
    emitToClient(clientId, event, data) {
        const client = this.clients.get(clientId);
        if (!client) {
            return;
        }
        client.emit(event, data);
    }
    joinRoom(client, room) {
        client.join(room);
    }
    leaveRoom(client, room) {
        client.leave(room);
    }
    broadcastToRoom(room, event, data) { }
    async create(createConversationDto) {
        const { participants, groupName, admin } = createConversationDto;
        const conversationData = {
            participants: participants.map((id) => ({ _id: id.toString() })),
        };
        if (groupName) {
            conversationData.groupName = groupName;
            conversationData.admin = {
                _id: admin._id.toString(),
                name: admin.name,
            };
        }
        const newConv = this.conversationRepository.create(conversationData);
        return await this.conversationRepository.save(newConv);
    }
    async getOrCreateDirectConversation({ userId, otherId, }) {
        const qb = this.conversationRepository.createQueryBuilder('conversation')
            .leftJoinAndSelect('conversation.participants', 'participant')
            .where('conversation.groupName IS NULL');
        const conversations = await qb.getMany();
        const existingConversation = conversations.find(c => {
            const pIds = c.participants.map(p => p._id);
            return pIds.includes(userId) && pIds.includes(otherId) && pIds.length === 2;
        });
        if (existingConversation) {
            return existingConversation;
        }
        const newConversation = this.conversationRepository.create({
            participants: [{ _id: userId }, { _id: otherId }],
        });
        return await this.conversationRepository.save(newConversation);
    }
    async getConversationById({ conversationId }) {
        const conversation = await this.conversationRepository.findOne({ where: { _id: conversationId }, relations: ['participants'] });
        if (!conversation) {
            throw new common_1.NotFoundException(`Conversation with ID ${conversationId} not found.`);
        }
        return conversation;
    }
    async getRecentConversations({ userId, lastConversationId, }) {
        let lastActivityFilter = null;
        if (lastConversationId) {
            const lastConv = await this.conversationRepository.findOne({ where: { _id: lastConversationId } });
            if (lastConv)
                lastActivityFilter = lastConv.lastActivity;
        }
        const qb = this.conversationRepository.createQueryBuilder('conversation')
            .leftJoinAndSelect('conversation.participants', 'participant')
            .where('participant._id = :userId', { userId })
            .orderBy('conversation.lastActivity', 'DESC')
            .take(10);
        if (lastActivityFilter) {
            qb.andWhere('conversation.lastActivity < :lastActivity', { lastActivity: lastActivityFilter });
        }
        const conversations = await qb.getMany();
        const conversationItems = await Promise.all(conversations.map(async (conv) => {
            const latestMsgDoc = await this.messageRepository.findOne({
                where: { conversationId: conv._id, isDeleted: false },
                order: { createdAt: 'DESC' }
            });
            let name = '';
            let avatar = '';
            if (conv.groupName) {
                name = conv.groupName;
                avatar = 'https://picsum.photos/200';
            }
            else {
                const otherParticipant = conv.participants.find((p) => p._id !== userId);
                if (otherParticipant) {
                    name = otherParticipant.name;
                    avatar = 'https://picsum.photos/200';
                }
            }
            return {
                id: conv._id,
                avatar,
                name,
                timestamp: conv.lastActivity?.toISOString() || new Date().toISOString(),
                latestMessage: latestMsgDoc?.content || '',
                isTyping: false,
                unreadCount: 0,
            };
        }));
        return conversationItems;
    }
    async createMessage(createMessageDto) {
        const { conversationId, senderId, content, attachments } = createMessageDto;
        const conversation = await this.conversationRepository.findOne({ where: { _id: conversationId }, relations: ['participants'] });
        if (!conversation) {
            throw new common_1.NotFoundException(`Conversation with ID ${conversationId} not found.`);
        }
        const newMessage = this.messageRepository.create({
            conversationId: conversationId.toString(),
            senderId: senderId.toString(),
            content,
            attachments,
            readBy: [],
            createdAt: new Date(),
            isDeleted: false,
        });
        const savedMsg = await this.messageRepository.save(newMessage);
        conversation.lastActivity = new Date();
        await this.conversationRepository.save(conversation);
        if (conversation.groupName) {
            this.wsService.broadcastToRoom(CHAT_NAME_SPACE, conversationId, 'newMessage', savedMsg);
        }
        else {
            const receiverIds = conversation.participants
                .filter((participant) => participant._id !== senderId)
                .map((p) => p._id);
            if (receiverIds.length !== 1) {
                console.error('Direct message error - Expected exactly 1 receiver, got:', { receiverIds });
            }
            else {
                const receiverId = receiverIds[0];
                this.emitToClient(receiverId, 'newMessage', savedMsg);
            }
        }
        return savedMsg;
    }
    async getMessages({ conversationId, lastMessageId, }) {
        let lastMsgFilter = null;
        if (lastMessageId) {
            const last = await this.messageRepository.findOne({ where: { _id: lastMessageId } });
            if (last)
                lastMsgFilter = last.createdAt;
        }
        const qb = this.messageRepository.createQueryBuilder('message')
            .where('message.conversationId = :cid', { cid: conversationId })
            .andWhere('message.isDeleted = false')
            .orderBy('message.createdAt', 'DESC')
            .take(10);
        if (lastMsgFilter) {
            qb.andWhere('message.createdAt < :lastAt', { lastAt: lastMsgFilter });
        }
        return await qb.getMany();
    }
    findAll() {
        return `This action returns all chat`;
    }
    findOne(id) {
        return `This action returns a #${id} chat`;
    }
    remove(id) {
        return `This action removes a #${id} chat`;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conversation_entity_1.Conversation)),
    __param(1, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        ws_service_1.WsService,
        jwt_1.JwtService,
        config_1.ConfigService])
], ChatService);
//# sourceMappingURL=chat.service.js.map