import mongoose from 'mongoose';
export declare class CreateProjectDto {
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
    startDate: Date;
    endDate: Date;
    actualEndDate: Date;
}
