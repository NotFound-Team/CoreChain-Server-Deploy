import { ClientKafka } from '@nestjs/microservices';
import { TaskCreatedEventDto } from './dto/task-event.dto';
export declare class NotificationService {
    private readonly kafkaClient;
    private readonly logger;
    private isConnected;
    private isConnecting;
    constructor(kafkaClient: ClientKafka);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private ensureKafkaConnection;
    publishTaskCreated(event: TaskCreatedEventDto): Promise<void>;
}
