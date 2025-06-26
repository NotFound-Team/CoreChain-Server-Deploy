import mongoose, { HydratedDocument } from 'mongoose';
export type SalaryAdvanceDocument = HydratedDocument<SalaryAdvance>;
export declare class SalaryAdvance {
    employee: mongoose.Schema.Types.ObjectId;
    amount: number;
    reason: string;
    isApproved: boolean;
    approvedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
    returnDate: Date;
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
export declare const SalaryAdvanceSchema: mongoose.Schema<SalaryAdvance, mongoose.Model<SalaryAdvance, any, any, any, mongoose.Document<unknown, any, SalaryAdvance> & SalaryAdvance & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, SalaryAdvance, mongoose.Document<unknown, {}, mongoose.FlatRecord<SalaryAdvance>> & mongoose.FlatRecord<SalaryAdvance> & {
    _id: mongoose.Types.ObjectId;
}>;
