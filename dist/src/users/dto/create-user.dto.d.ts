export declare class AdjustmentDto {
    amount: number;
    reason: string;
    createdAt?: Date;
}
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: string;
    workingHours: number;
    employeeId: string;
    position: string;
    department: string;
    netSalary: number;
    avatar: string;
    personalIdentificationNumber: string;
    dateOfBirth: Date;
    personalPhoneNumber: string;
    male: boolean;
    nationality: string;
    permanentAddress: string;
    biometricData: string;
    employeeContractCode: string;
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
