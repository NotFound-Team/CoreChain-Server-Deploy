import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { DecryptRequestDto } from './dto/decrypt-request.dto';
import { IUser } from 'src/users/users.interface';
export declare class FeedbackController {
    private readonly feedbackService;
    constructor(feedbackService: FeedbackService);
    create(createFeedbackDto: CreateFeedbackDto): Promise<import("mongoose").Types.ObjectId>;
    trace(id: string, decryptRequest: DecryptRequestDto, user: IUser): Promise<string>;
    findAll(currentPage: string, limit: string, qs: string): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: import("./feedback.interface").IFeedback[];
    }>;
    findOne(id: string): Promise<import("./feedback.interface").IFeedback>;
    remove(id: string, user: IUser): Promise<{
        deleted: number;
    }>;
}
