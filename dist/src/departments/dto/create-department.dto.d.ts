import mongoose from 'mongoose';
export declare class CreateDepartmentDto {
    name: string;
    code: string;
    description: string;
    manager: mongoose.Schema.Types.ObjectId;
    employees: Array<mongoose.Schema.Types.ObjectId | string>;
    status: string;
    budget: number;
    projectIds: Array<mongoose.Schema.Types.ObjectId>;
}
