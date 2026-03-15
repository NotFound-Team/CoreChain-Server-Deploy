import { User } from '../../users/entities/user.entity';
export declare class SalaryAdvance {
    _id: string;
    employee: User;
    amount: number;
    reason: string;
    isApproved: boolean;
    approvedBy: {
        _id: string;
        email: string;
    } | string;
    returnDate: Date;
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
