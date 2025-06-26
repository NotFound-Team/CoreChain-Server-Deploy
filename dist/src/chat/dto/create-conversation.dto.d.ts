export declare class AdminDto {
    _id: string;
    name: string;
}
export declare class CreateConversationDto {
    participants: string[];
    groupName?: string;
    admin: AdminDto;
}
