import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { IUser } from 'src/users/users.interface';
export declare class PositionsController {
    private readonly positionsService;
    constructor(positionsService: PositionsService);
    create(createPositionDto: CreatePositionDto, user: IUser): Promise<string>;
    findAll(query: any): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: import("./position.interface").IPosition[];
    }>;
    findOne(id: string): Promise<import("./position.interface").IPosition>;
    update(id: string, updatePositionDto: UpdatePositionDto, user: IUser): Promise<import("./entities/position.entity").Position>;
    remove(id: string, user: IUser): Promise<import("typeorm").UpdateResult>;
}
