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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(kafkaClient) {
        this.kafkaClient = kafkaClient;
        this.logger = new common_1.Logger(NotificationService_1.name);
        this.isConnected = false;
        this.isConnecting = false;
    }
    async onModuleInit() {
        try {
            this.logger.log('Attempting to connect to Kafka...');
            await this.ensureKafkaConnection();
            this.logger.log('Kafka client connected successfully');
        }
        catch (error) {
            this.logger.warn('Failed to connect to Kafka at startup. Will retry on first publish attempt.', error.message);
        }
    }
    async onModuleDestroy() {
        if (this.isConnected) {
            try {
                await this.kafkaClient.close();
                this.logger.log('Kafka client disconnected');
            }
            catch (error) {
                this.logger.error('Error disconnecting from Kafka:', error);
            }
        }
    }
    async ensureKafkaConnection() {
        if (this.isConnected) {
            return;
        }
        if (this.isConnecting) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return this.ensureKafkaConnection();
        }
        this.isConnecting = true;
        try {
            await this.kafkaClient.connect();
            this.isConnected = true;
        }
        finally {
            this.isConnecting = false;
        }
    }
    async publishTaskCreated(event) {
        try {
            await this.ensureKafkaConnection();
            this.logger.log(`Publishing task.created event for task: ${event.data._id}`);
            await this.kafkaClient.emit('task.created', {
                key: event.data._id,
                value: JSON.stringify(event),
            });
            this.logger.log(`Successfully published task.created event for task: ${event.data._id}`);
        }
        catch (error) {
            this.logger.error(`Failed to publish task.created event for task: ${event.data._id}`, error.stack);
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('KAFKA_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientKafka])
], NotificationService);
//# sourceMappingURL=notification.service.js.map