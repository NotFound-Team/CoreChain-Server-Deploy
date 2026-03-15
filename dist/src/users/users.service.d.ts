import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePassword, UpdatePublicUserDto, UpdateUserDto, UpdateWorkingHoursDto } from './dto/update-user.dto';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { CompleteUser, IUser } from './users.interface';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { SecurityService } from 'src/security/security.service';
import { DepartmentsService } from 'src/departments/departments.service';
import { Cache } from 'cache-manager';
export declare class UsersService {
    private userRepository;
    private dataSource;
    private configService;
    private blockchainService;
    private securityService;
    private departmentService;
    private cacheManager;
    constructor(userRepository: Repository<User>, dataSource: DataSource, configService: ConfigService, blockchainService: BlockchainService, securityService: SecurityService, departmentService: DepartmentsService, cacheManager: Cache);
    isValidId(id: string): boolean;
    getHashPassword: (password: string) => string;
    isValidPassword(password: string, hashPassword: string): boolean;
    getUserByToken: (refreshToken: string) => Promise<User>;
    updateUserToken: (refreshToken: string, _id: string) => Promise<User>;
    findOneByUsername(username: string): Promise<User>;
    PRIVATE_FIELDS: string[];
    splitData(updateUserDto: UpdateUserDto | CreateUserDto): {
        employeeId: string;
        privateData: Record<string, any>;
        publicData: Record<string, any>;
    };
    setCached(id: string, data: unknown): Promise<void>;
    getCached(id: string): Promise<CompleteUser>;
    delCached(id: string): Promise<void>;
    create(createUserDto: CreateUserDto, user: IUser): Promise<string>;
    findAll(query: any): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: {
            _id: string;
            name: string;
            email: string;
            avatar: string;
            role: import("../roles/entities/role.entity").Role;
            department: import("../departments/entities/department.entity").Department;
            txHash: string;
            workingHours: number;
            kpi: number;
            dayOff: number;
            employeeId: string;
            position: import("../positions/entities/position.entity").Position;
            fcmToken: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date;
            isDeleted: boolean;
            createdBy: {
                _id: string;
                email: string;
            };
            updatedBy: {
                _id: string;
                email: string;
            };
            deletedBy: {
                _id: string;
                email: string;
            };
        }[];
    }>;
    findAllByIds(ids: string[]): Promise<{
        _id: string;
        name: string;
        email: string;
        avatar: string;
        role: import("../roles/entities/role.entity").Role;
        department: import("../departments/entities/department.entity").Department;
        txHash: string;
        workingHours: number;
        kpi: number;
        dayOff: number;
        employeeId: string;
        position: import("../positions/entities/position.entity").Position;
        fcmToken: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        isDeleted: boolean;
        createdBy: {
            _id: string;
            email: string;
        };
        updatedBy: {
            _id: string;
            email: string;
        };
        deletedBy: {
            _id: string;
            email: string;
        };
    }[]>;
    findOnePublic(id: string): Promise<User>;
    findOne(id: string): Promise<{
        _id: string;
        name: string;
        email: string;
        avatar: string;
        role: import("../roles/entities/role.entity").Role;
        department: import("../departments/entities/department.entity").Department;
        txHash: string;
        workingHours: number;
        kpi: number;
        dayOff: number;
        employeeId: string;
        position: import("../positions/entities/position.entity").Position;
        fcmToken: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        isDeleted: boolean;
        createdBy: {
            _id: string;
            email: string;
        };
        updatedBy: {
            _id: string;
            email: string;
        };
        deletedBy: {
            _id: string;
            email: string;
        };
    }>;
    findByIds(ids: string[]): Promise<{
        _id: string;
        name: string;
        email: string;
        avatar: string;
        role: import("../roles/entities/role.entity").Role;
        department: import("../departments/entities/department.entity").Department;
        txHash: string;
        workingHours: number;
        kpi: number;
        dayOff: number;
        employeeId: string;
        position: import("../positions/entities/position.entity").Position;
        fcmToken: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        isDeleted: boolean;
        createdBy: {
            _id: string;
            email: string;
        };
        updatedBy: {
            _id: string;
            email: string;
        };
        deletedBy: {
            _id: string;
            email: string;
        };
    }[]>;
    findPrivateOne(id: string): Promise<CompleteUser>;
    update(updateUserDto: UpdateUserDto, user: IUser, id: string): Promise<User>;
    updateWorkingHours(updateWorkingHoursDto: UpdateWorkingHoursDto, user: IUser, id: string): Promise<User>;
    updatePublicUser(updatePublicUserDto: UpdatePublicUserDto, user: IUser, id: string): Promise<User>;
    updateFcmToken(userId: string, fcmToken: string): Promise<{
        message: string;
        userId: string;
    }>;
    changePassword(updatePassword: UpdatePassword, thisUser: IUser): Promise<string>;
    remove(id: string, user: IUser): Promise<User>;
}
