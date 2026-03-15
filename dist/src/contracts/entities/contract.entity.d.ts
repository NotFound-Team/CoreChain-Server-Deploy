import { User } from '../../users/entities/user.entity';
export declare class Contract {
    _id: string;
    contractCode: string;
    type: string;
    file: string;
    startDate: Date;
    endDate: Date;
    status: string;
    employee: User;
    salary: number;
    allowances: number;
    insurance: string;
    workingHours: number;
    leavePolicy: string;
    terminationTerms: string;
    confidentialityClause: string;
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
