import mongoose, { HydratedDocument } from 'mongoose';
export type DepartmentDocument = HydratedDocument<Department>;
export declare class Department {
    name: string;
    code: string;
    description: string;
    manager: mongoose.Schema.Types.ObjectId;
    employees: Array<mongoose.Schema.Types.ObjectId>;
    status: string;
    budget: number;
    projectIds: Array<mongoose.Schema.Types.ObjectId>;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
}
export declare const DepartmentSchema: mongoose.Schema<Department, mongoose.Model<Department, any, any, any, mongoose.Document<unknown, any, Department> & Department & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Department, mongoose.Document<unknown, {}, mongoose.FlatRecord<Department>> & mongoose.FlatRecord<Department> & {
    _id: mongoose.Types.ObjectId;
}>;
