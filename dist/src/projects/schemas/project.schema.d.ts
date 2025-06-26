import mongoose, { HydratedDocument } from 'mongoose';
export type ProjectDocument = HydratedDocument<Project>;
export declare class Project {
    name: string;
    description: string;
    attachments: Array<string>;
    department: mongoose.Schema.Types.ObjectId;
    manager: mongoose.Schema.Types.ObjectId;
    teamMembers: Array<mongoose.Schema.Types.ObjectId>;
    tasks: Array<mongoose.Schema.Types.ObjectId>;
    expenses: Array<{
        cost: number;
        reason: string;
    }>;
    revenue: number;
    priority: number;
    status: number;
    progress: number;
    startDate: Date;
    endDate: Date;
    actualEndDate: Date;
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
export declare const ProjectSchema: mongoose.Schema<Project, mongoose.Model<Project, any, any, any, mongoose.Document<unknown, any, Project> & Project & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Project, mongoose.Document<unknown, {}, mongoose.FlatRecord<Project>> & mongoose.FlatRecord<Project> & {
    _id: mongoose.Types.ObjectId;
}>;
