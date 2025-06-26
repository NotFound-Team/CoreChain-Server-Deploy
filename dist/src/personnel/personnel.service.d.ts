import { UsersService } from 'src/users/users.service';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { IUser } from 'src/users/users.interface';
import { UpdateWorkingHoursDto } from 'src/users/dto/update-user.dto';
import { TasksService } from 'src/tasks/tasks.service';
import { SalaryAdvanceDto } from './dto/salary-advance.dto';
import { SalaryAdvanceDocument } from './schemas/salary-advance.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import { ISalaryAdvance } from './personnel.interface';
export declare class PersonnelService {
    private salaryAdvanceModel;
    private userService;
    private taskService;
    constructor(salaryAdvanceModel: SoftDeleteModel<SalaryAdvanceDocument>, userService: UsersService, taskService: TasksService);
    calSalary(id: string, user: IUser): Promise<number>;
    salaryAdvance(salaryAdvanceDto: SalaryAdvanceDto, user: IUser): Promise<{
        message: string;
    }>;
    approveSalaryAdvance(user: IUser, id: string): Promise<{
        message: string;
    }>;
    findOne(id: string): Promise<ISalaryAdvance>;
    findAll(currentPage: number, limit: number, qs: string): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: ISalaryAdvance[];
    }>;
    calKpi(id: string, user: IUser): Promise<number>;
    addAdjustments(id: string, updatePersonnelDto: UpdatePersonnelDto, user: IUser): Promise<mongoose.UpdateWriteOpResult>;
    updateWorkingHours(updateWorkingHoursDto: UpdateWorkingHoursDto, user: IUser, id: string): Promise<mongoose.UpdateWriteOpResult>;
}
