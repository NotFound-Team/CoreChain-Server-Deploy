import { HydratedDocument, Types, Document } from 'mongoose';
export type ConversationDocument = HydratedDocument<Conversation>;
export interface PopulatedUser {
    _id: Types.ObjectId;
    name: string;
}
export type ConversationPopulated = Conversation & {
    participants: PopulatedUser[];
};
export type ConversationPopulatedDocument = HydratedDocument<ConversationPopulated>;
export declare class Conversation extends Document {
    participants: Types.ObjectId[];
    groupName?: string;
    admin?: {
        _id: Types.ObjectId;
        name: string;
    };
    createdBy?: Types.ObjectId;
    lastActivity: Date;
}
export declare const ConversationSchema: import("mongoose").Schema<Conversation, import("mongoose").Model<Conversation, any, any, any, Document<unknown, any, Conversation> & Conversation & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Conversation, Document<unknown, {}, import("mongoose").FlatRecord<Conversation>> & import("mongoose").FlatRecord<Conversation> & {
    _id: Types.ObjectId;
}>;
