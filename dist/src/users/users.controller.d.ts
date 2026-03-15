import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePassword, UpdatePublicUserDto, UpdateUserDto, UpdateWorkingHoursDto } from './dto/update-user.dto';
import { UpdateFcmTokenDto } from './dto/update-fcm-token.dto';
import { IUser } from './users.interface';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    findOnePublic(id: string): Promise<import("./entities/user.entity").User>;
    findPrivateOne(id: string): Promise<import("./users.interface").CompleteUser>;
    update(updateUserDto: UpdateUserDto, id: string, user: IUser): Promise<import("./entities/user.entity").User>;
    updatePublic(updatePublicUserDto: UpdatePublicUserDto, id: string, user: IUser): Promise<import("./entities/user.entity").User>;
    updateWorkingHours(updateWorkingHoursDto: UpdateWorkingHoursDto, id: string, user: IUser): Promise<import("./entities/user.entity").User>;
    updateFcmToken(id: string, updateFcmTokenDto: UpdateFcmTokenDto, user: IUser): Promise<{
        message: string;
        userId: string;
    }>;
    changePass(updatePassword: UpdatePassword, user: IUser): Promise<string>;
    remove(id: string, user: IUser): Promise<import("./entities/user.entity").User>;
}
