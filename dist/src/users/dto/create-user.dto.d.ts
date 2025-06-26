import mongoose from 'mongoose';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: mongoose.Schema.Types.ObjectId;
    workingHours: number;
    employeeId: string;
    position: mongoose.Schema.Types.ObjectId;
    department: mongoose.Schema.Types.ObjectId;
}
