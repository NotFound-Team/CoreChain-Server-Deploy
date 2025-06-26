import { CreateUserDto } from './create-user.dto';
import mongoose from 'mongoose';
export declare class AdjustmentDto {
    amount: number;
    reason: string;
    createdAt?: Date;
}
declare const UpdateUserDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    netSalary: number;
    avatar: string;
    personalIdentificationNumber: string;
    dateOfBirth: Date;
    personalPhoneNumber: string;
    male: boolean;
    nationality: string;
    permanentAddress: string;
    biometricData: string;
    employeeContractCode: mongoose.Schema.Types.ObjectId;
    salary: number;
    allowances: number;
    adjustments: AdjustmentDto[];
    loansSupported: number;
    healthCheckRecordCode: string[];
    medicalHistory: string;
    healthInsuranceCode: string;
    lifeInsuranceCode: string;
    socialInsuranceNumber: string;
    personalTaxIdentificationNumber: string;
    backAccountNumber: string;
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
