import mongoose from 'mongoose';
export declare class CreateTaskDto {
    title: string;
    description: string;
    attachments: Array<string>;
    assignedTo: mongoose.Schema.Types.ObjectId;
    projectId: mongoose.Schema.Types.ObjectId;
    priority: number;
    status: number;
    startDate: Date;
    dueDate: Date;
}
