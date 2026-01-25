import { CreateUserDto } from './create-user.dto';
import mongoose from 'mongoose';
declare const UpdateUserDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
}
export declare class UpdateWorkingHoursDto {
    workingHours: number;
}
declare const UpdatePublicUserDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateUserDto>>;
export declare class UpdatePublicUserDto extends UpdatePublicUserDto_base {
    kpi?: number;
    dayOff?: number;
}
export declare class UpdatePassword {
    id: mongoose.Schema.Types.ObjectId;
    oldPassword: string;
    newPassword: string;
}
export {};
