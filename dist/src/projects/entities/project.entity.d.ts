import { Department } from '../../departments/entities/department.entity';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';
export declare class Project {
    _id: string;
    name: string;
    description: string;
    attachments: string[];
    department: Department;
    manager: User;
    teamMembers: User[];
    tasks: Task[];
    expenses: {
        cost: number;
        reason: string;
    }[];
    revenue: number;
    priority: number;
    status: number;
    progress: number;
    startDate: Date;
    endDate: Date;
    actualEndDate: Date;
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
