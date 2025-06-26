import mongoose, { HydratedDocument } from 'mongoose';
export type TaskDocument = HydratedDocument<Task>;
export declare class Task {
    title: string;
    description: string;
    attachments: Array<string>;
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
    assignedTo: mongoose.Schema.Types.ObjectId;
    projectId: mongoose.Schema.Types.ObjectId;
    priority: number;
    status: number;
    startDate: Date;
    dueDate: Date;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
}
export declare const TaskSchema: mongoose.Schema<Task, mongoose.Model<Task, any, any, any, mongoose.Document<unknown, any, Task> & Task & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Task, mongoose.Document<unknown, {}, mongoose.FlatRecord<Task>> & mongoose.FlatRecord<Task> & {
    _id: mongoose.Types.ObjectId;
}>;
