import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePassword, UpdatePublicUserDto, UpdateUserDto, UpdateWorkingHoursDto } from './dto/update-user.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { CompleteUser, IUser, PublicUser } from './users.interface';
import mongoose from 'mongoose';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { SecurityService } from 'src/security/security.service';
import { DepartmentsService } from 'src/departments/departments.service';
import { Cache } from 'cache-manager';
export declare class UsersService {
    private userModel;
    private configService;
    private blockchainService;
    private securityService;
    private departmentService;
    private cacheManager;
    constructor(userModel: SoftDeleteModel<UserDocument>, configService: ConfigService, blockchainService: BlockchainService, securityService: SecurityService, departmentService: DepartmentsService, cacheManager: Cache);
    getHashPassword: (password: string) => string;
    isValidPassword(password: string, hashPassword: string): boolean;
    getUserByToken: (refreshToken: string) => Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    }> & mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    updateUserToken: (refreshToken: string, _id: string) => Promise<mongoose.UpdateWriteOpResult>;
    findOneByUsername(username: string): mongoose.Query<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    }> & mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>, mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    }> & mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>, {}, mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    }, "findOne">;
    PRIVATE_FIELDS: string[];
    splitData(updateUserDto: UpdateUserDto): {
        employeeId: string;
        privateData: Record<string, any>;
        publicData: Record<string, any>;
    };
    setCached(id: string, data: unknown): Promise<void>;
    getCached(id: string): Promise<CompleteUser>;
    delCached(id: string): Promise<void>;
    create(createUserDto: CreateUserDto, user: IUser): Promise<mongoose.Types.ObjectId>;
    findAll(currentPage: number, limit: number, qs: string): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: PublicUser[];
    }>;
    findOne(id: string): Promise<PublicUser>;
    findByIds(ids: string[]): Promise<Omit<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    }> & mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>, never>[]>;
    findPrivateOne(id: string): Promise<CompleteUser>;
    update(updateUserDto: UpdateUserDto, user: IUser, id: string): Promise<mongoose.UpdateWriteOpResult>;
    updateWorkingHours(updateWorkingHoursDto: UpdateWorkingHoursDto, user: IUser, id: string): Promise<mongoose.UpdateWriteOpResult>;
    updatePublicUser(updatePublicUserDto: UpdatePublicUserDto, user: IUser, id: string): Promise<mongoose.UpdateWriteOpResult>;
    changePassword(updatePassword: UpdatePassword, thisUser: IUser): Promise<string>;
    remove(id: string, user: IUser): Promise<{
        deleted: number;
    }>;
}
