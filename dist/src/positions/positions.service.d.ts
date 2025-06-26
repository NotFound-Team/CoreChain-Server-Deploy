import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { IUser } from 'src/users/users.interface';
import { PositionDocument } from './schemas/position.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import { IPosition } from './position.interface';
export declare class PositionsService {
    private positionModel;
    constructor(positionModel: SoftDeleteModel<PositionDocument>);
    create(createPositionDto: CreatePositionDto, user: IUser): Promise<mongoose.Types.ObjectId>;
    findAll(currentPage: number, limit: number, qs: string): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: IPosition[];
    }>;
    findOne(id: string): Promise<void>;
    update(id: string, updatePositionDto: UpdatePositionDto, user: IUser): Promise<mongoose.UpdateWriteOpResult>;
    remove(id: string, user: IUser): Promise<{
        deleted: number;
    }>;
}
