import { Role } from '../../roles/entities/role.entity';
import { Department } from '../../departments/entities/department.entity';
import { Position } from '../../positions/entities/position.entity';
export declare class User {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    password?: string;
    role: Role;
    department: Department;
    txHash: string;
    workingHours: number;
    refreshToken: string;
    kpi: number;
    dayOff: number;
    employeeId: string;
    position: Position;
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
}
