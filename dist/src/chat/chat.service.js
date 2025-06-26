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
const conversation_schema_1 = require("./schemas/conversation.schema");
const mongoose_1 = require("@nestjs/mongoose");
const message_schema_1 = require("./schemas/message.schema");
const ws_service_1 = require("../ws/ws.service");
const mongoose_2 = require("mongoose");
const config_1 = require("@nestjs/config");
const CHAT_NAME_SPACE = '/chat';
let ChatService = class ChatService {
    constructor(conversationModel, messageModel, wsService, jwtService, configService) {
        this.conversationModel = conversationModel;
        this.messageModel = messageModel;
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
            this.clients.set(payload._id, client);
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
            participants: participants.map((id) => new mongoose_2.Types.ObjectId(id)),
        };
        if (groupName) {
            conversationData.groupName = groupName;
            conversationData.admin = {
                _id: new mongoose_2.Types.ObjectId(admin._id),
                name: admin.name,
            };
        }
        return await this.conversationModel.create(conversationData);
    }
    async getOrCreateDirectConversation({ userId, otherId, }) {
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const otherObjectId = new mongoose_2.Types.ObjectId(otherId);
        const existingConversation = await this.conversationModel.findOne({
            participants: { $all: [userObjectId, otherObjectId] },
            groupName: { $exists: false },
        });
        if (existingConversation) {
            return existingConversation;
        }
        const newConversation = await this.conversationModel.create({
            participants: [userObjectId, otherObjectId],
        });
        return newConversation;
    }
    async getConversationById({ conversationId }) {
        const conversation = await this.conversationModel
            .findById(conversationId)
            .exec();
        if (!conversation) {
            throw new common_1.NotFoundException(`Conversation with ID ${conversationId} not found.`);
        }
        return conversation;
    }
    async getRecentConversations({ userId, lastConversationId, }) {
        const filter = { participants: new mongoose_2.Types.ObjectId(userId) };
        if (lastConversationId) {
            const lastConversation = await this.conversationModel
                .findById(lastConversationId)
                .exec();
            if (lastConversation) {
                filter.lastActivity = { $lt: lastConversation.lastActivity };
            }
        }
        const conversations = (await this.conversationModel
            .find(filter)
            .sort({ lastActivity: -1 })
            .limit(10)
            .populate({ path: 'participants', select: 'name' })
            .exec());
        const conversationItems = await Promise.all(conversations.map(async (conv) => {
            const latestMsgDoc = await this.messageModel
                .findOne({ conversationId: conv._id })
                .sort({ createdAt: -1 })
                .exec();
            let name = '';
            let avatar = '';
            if (conv.groupName) {
                name = conv.groupName;
                avatar = 'https://picsum.photos/200';
            }
            else {
                const otherParticipant = conv.participants.find((p) => p._id.toString() !== userId);
                if (otherParticipant) {
                    name = otherParticipant.name;
                    avatar = 'https://picsum.photos/200';
                }
            }
            return {
                id: conv._id.toString(),
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
        const conversation = await this.conversationModel.findById(conversationId);
        if (!conversation) {
            throw new common_1.NotFoundException(`Conversation with ID ${conversationId} not found.`);
        }
        const newMessage = await this.messageModel.create({
            conversationId: new mongoose_2.Types.ObjectId(conversationId),
            senderId: new mongoose_2.Types.ObjectId(senderId),
            content,
            attachments,
            readBy: [],
            createdAt: new Date(),
            isDeleted: false,
        });
        conversation.lastActivity = new Date();
        await conversation.save();
        if (conversation.groupName) {
            this.wsService.broadcastToRoom(CHAT_NAME_SPACE, conversationId, 'newMessage', newMessage);
        }
        else {
            const receiverIds = conversation.participants
                .filter((participant) => participant.toString() !== senderId)
                .map((id) => id.toString());
            if (receiverIds.length !== 1) {
                console.error('Direct message error - Expected exactly 1 receiver, got:', { receiverIds });
                throw new Error('Invalid conversation participants for direct message.');
            }
            const receiverId = receiverIds[0].toString();
            console.log(receiverId);
            console.log();
            this.emitToClient(receiverId, 'newMessage', newMessage);
        }
        return newMessage;
    }
    async getMessages({ conversationId, lastMessageId, }) {
        const filter = { conversationId: new mongoose_2.Types.ObjectId(conversationId) };
        if (lastMessageId) {
            const lastMessage = await this.messageModel
                .findById(lastMessageId)
                .exec();
            if (lastMessage) {
                filter.createdAt = { $lt: lastMessage.createdAt };
            }
        }
        const messages = await this.messageModel
            .find(filter)
            .sort({ createdAt: -1 })
            .limit(10)
            .exec();
        return messages;
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
    __param(0, (0, mongoose_1.InjectModel)(conversation_schema_1.Conversation.name)),
    __param(1, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __metadata("design:paramtypes", [Object, Object, ws_service_1.WsService,
        jwt_1.JwtService,
        config_1.ConfigService])
], ChatService);
//# sourceMappingURL=chat.service.js.map