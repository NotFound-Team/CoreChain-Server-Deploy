export declare class CreateProjectDto {
    name: string;
    description: string;
    attachments: Array<string>;
    department: string;
    manager: string;
    teamMembers: Array<string>;
    tasks: Array<string>;
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
