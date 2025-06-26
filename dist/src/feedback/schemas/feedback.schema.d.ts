import mongoose, { HydratedDocument } from 'mongoose';
export type FeedbackDocument = HydratedDocument<Feedback>;
export declare class Feedback {
    encryptedEmployeeId: string;
    category: string;
    isFlagged: boolean;
    wasDecrypted: boolean;
    decryptionReason: string;
    decryptedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
    approvedBy: string;
    title: string;
    content: string;
    isDeleted: boolean;
    createdAt: Date;
    deletedAt: Date;
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
}
export declare const FeedbackSchema: mongoose.Schema<Feedback, mongoose.Model<Feedback, any, any, any, mongoose.Document<unknown, any, Feedback> & Feedback & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Feedback, mongoose.Document<unknown, {}, mongoose.FlatRecord<Feedback>> & mongoose.FlatRecord<Feedback> & {
    _id: mongoose.Types.ObjectId;
}>;
