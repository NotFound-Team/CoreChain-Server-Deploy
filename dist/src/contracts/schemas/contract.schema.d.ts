import mongoose, { HydratedDocument } from 'mongoose';
export type ContractDocument = HydratedDocument<Contract>;
export declare class Contract {
    contractCode: string;
    type: string;
    file: string;
    startDate: Date;
    endDate: Date;
    status: string;
    employee: mongoose.Schema.Types.ObjectId;
    salary: number;
    allowances: number;
    insurance: string;
    workingHours: number;
    leavePolicy: string;
    terminationTerms: string;
    confidentialityClause: string;
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
export declare const ContractSchema: mongoose.Schema<Contract, mongoose.Model<Contract, any, any, any, mongoose.Document<unknown, any, Contract> & Contract & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Contract, mongoose.Document<unknown, {}, mongoose.FlatRecord<Contract>> & mongoose.FlatRecord<Contract> & {
    _id: mongoose.Types.ObjectId;
}>;
