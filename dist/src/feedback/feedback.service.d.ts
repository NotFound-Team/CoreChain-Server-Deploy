import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackDocument } from './schemas/feedback.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { SecurityService } from 'src/security/security.service';
import { DecryptRequestDto } from './dto/decrypt-request.dto';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import { IFeedback } from './feedback.interface';
export declare class FeedbackService {
    private feedbackModel;
    private encryptionService;
    private readonly logger;
    constructor(feedbackModel: SoftDeleteModel<FeedbackDocument>, encryptionService: SecurityService);
    createFeedback(createFeedbackDto: CreateFeedbackDto): Promise<mongoose.Types.ObjectId>;
    private shouldFlagFeedback;
    decryptEmployeeId(feedbackId: string, decryptRequest: DecryptRequestDto, user: IUser): Promise<string>;
    findAll(currentPage: number, limit: number, qs: string): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: IFeedback[];
    }>;
    findOne(id: string): Promise<IFeedback>;
    remove(id: string, user: IUser): Promise<{
        deleted: number;
    }>;
}
