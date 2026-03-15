import { User } from '../../users/entities/user.entity';
export declare class Task {
    _id: string;
    title: string;
    description: string;
    attachments: string[];
    assignedTo: User;
    projectId: string;
    priority: number;
    status: number;
    startDate: Date;
    dueDate: Date;
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
