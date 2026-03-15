export declare class Feedback {
    _id: string;
    encryptedEmployeeId: string;
    category: string;
    isFlagged: boolean;
    wasDecrypted: boolean;
    decryptionReason: string;
    decryptedBy: {
        _id: string;
        email: string;
    };
    approvedBy: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    isDeleted: boolean;
    deletedBy: {
        _id: string;
        email: string;
    };
}
