import { PersonnelService } from './personnel.service';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { IUser } from 'src/users/users.interface';
import { UpdateWorkingHoursDto } from 'src/users/dto/update-user.dto';
import { SalaryAdvanceDto } from './dto/salary-advance.dto';
export declare class PersonnelController {
    private readonly personnelService;
    constructor(personnelService: PersonnelService);
    calculateSalary(id: string, user: IUser): Promise<number>;
    salaryAdvance(salaryAdvanceDto: SalaryAdvanceDto, user: IUser): Promise<{
        message: string;
    }>;
    approveSalaryAdvance(user: IUser, id: string): Promise<{
        message: string;
    }>;
    findOne(id: string): Promise<import("./personnel.interface").ISalaryAdvance>;
    findAll(currentPage: string, limit: string, qs: string): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: import("./personnel.interface").ISalaryAdvance[];
    }>;
    calculateKpi(id: string, user: IUser): Promise<number>;
    addAdjustments(id: string, updatePersonnelDto: UpdatePersonnelDto, user: IUser): Promise<import("mongoose").UpdateWriteOpResult>;
    updateWorkingHours(updateWorkingHoursDto: UpdateWorkingHoursDto, id: string, user: IUser): Promise<import("mongoose").UpdateWriteOpResult>;
}
