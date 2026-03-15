import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { IUser } from 'src/users/users.interface';
import { Repository } from 'typeorm';
import { Position } from './entities/position.entity';
import { IPosition } from './position.interface';
export declare class PositionsService {
    private positionRepository;
    constructor(positionRepository: Repository<Position>);
    isValidId(id: string): boolean;
    create(createPositionDto: CreatePositionDto, user: IUser): Promise<string>;
    findAll(query: any): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: IPosition[];
    }>;
    findOne(id: string): Promise<IPosition>;
    update(id: string, updatePositionDto: UpdatePositionDto, user: IUser): Promise<Position>;
    remove(id: string, user: IUser): Promise<import("typeorm").UpdateResult>;
}
