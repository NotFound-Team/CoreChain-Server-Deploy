import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePassword, UpdatePublicUserDto, UpdateUserDto, UpdateWorkingHoursDto } from './dto/update-user.dto';
import { IUser } from './users.interface';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto, user: IUser): Promise<import("mongoose").Types.ObjectId>;
    findAll(currentPage: string, limit: string, qs: string): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: import("./users.interface").PublicUser[];
    }>;
    findOne(id: string): Promise<import("./users.interface").PublicUser>;
    findPrivateOne(id: string): Promise<import("./users.interface").CompleteUser>;
    update(updateUserDto: UpdateUserDto, id: string, user: IUser): Promise<import("mongoose").UpdateWriteOpResult>;
    updatePublic(updatePublicUserDto: UpdatePublicUserDto, id: string, user: IUser): Promise<import("mongoose").UpdateWriteOpResult>;
    updateWorkingHours(updateWorkingHoursDto: UpdateWorkingHoursDto, id: string, user: IUser): Promise<import("mongoose").UpdateWriteOpResult>;
    changePass(updatePassword: UpdatePassword, user: IUser): Promise<string>;
    remove(id: string, user: IUser): Promise<{
        deleted: number;
    }>;
}
