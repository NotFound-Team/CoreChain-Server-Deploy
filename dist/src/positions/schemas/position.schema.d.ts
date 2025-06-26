import mongoose, { HydratedDocument } from 'mongoose';
export type PositionDocument = HydratedDocument<Position>;
export declare class Position {
    title: string;
    description: string;
    parentId: mongoose.Schema.Types.ObjectId;
    level: number;
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
export declare const PositionSchema: mongoose.Schema<Position, mongoose.Model<Position, any, any, any, mongoose.Document<unknown, any, Position> & Position & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Position, mongoose.Document<unknown, {}, mongoose.FlatRecord<Position>> & mongoose.FlatRecord<Position> & {
    _id: mongoose.Types.ObjectId;
}>;
