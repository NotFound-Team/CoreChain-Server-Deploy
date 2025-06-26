import { HydratedDocument, Types, Document } from 'mongoose';
export type MessageDocument = HydratedDocument<Message>;
export declare class Message extends Document {
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    content?: string;
    attachments?: string[];
    readBy: {
        _id: Types.ObjectId;
        name: string;
        avt: string;
    }[];
    createdAt: Date;
    isDeleted: boolean;
}
export declare const MessageSchema: import("mongoose").Schema<Message, import("mongoose").Model<Message, any, any, any, Document<unknown, any, Message> & Message & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Message, Document<unknown, {}, import("mongoose").FlatRecord<Message>> & import("mongoose").FlatRecord<Message> & {
    _id: Types.ObjectId;
}>;
