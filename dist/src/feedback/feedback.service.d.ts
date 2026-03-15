import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { SecurityService } from 'src/security/security.service';
import { DecryptRequestDto } from './dto/decrypt-request.dto';
import { IUser } from 'src/users/users.interface';
import { IFeedback } from './feedback.interface';
export declare class FeedbackService {
    private feedbackRepository;
    private encryptionService;
    private readonly logger;
    constructor(feedbackRepository: Repository<Feedback>, encryptionService: SecurityService);
    isValidId(id: string): boolean;
    createFeedback(createFeedbackDto: CreateFeedbackDto): Promise<string>;
    private shouldFlagFeedback;
    decryptEmployeeId(feedbackId: string, decryptRequest: DecryptRequestDto, user: IUser): Promise<string>;
    findAll(currentPage?: number, limit?: number): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: IFeedback[];
    }>;
    findOne(id: string): Promise<IFeedback>;
    remove(id: string, user: IUser): Promise<import("typeorm").UpdateResult>;
}
