import mongoose from 'mongoose';
export declare class AdjustmentDto {
    amount: number;
    reason: string;
    createdAt?: Date;
}
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: mongoose.Schema.Types.ObjectId;
    workingHours: number;
    employeeId: string;
    position: mongoose.Schema.Types.ObjectId;
    department: mongoose.Schema.Types.ObjectId;
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
