export declare class CreateTaskDto {
    title: string;
    description: string;
    attachments: Array<string>;
    assignedTo: string;
    projectId: string;
    priority: number;
    status: number;
    startDate: Date;
    dueDate: Date;
}
