export declare class Department {
    _id: string;
    name: string;
    code: string;
    description: string;
    manager: string;
    employees: string[];
    status: string;
    budget: number;
    projectIds: string[];
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
