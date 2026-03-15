import { User } from '../../users/entities/user.entity';
export declare class Conversation {
    _id: string;
    participants: User[];
    groupName: string;
    admin: {
        _id: string;
        name: string;
    };
    createdBy: User;
    lastActivity: Date;
    createdAt: Date;
    updatedAt: Date;
}
