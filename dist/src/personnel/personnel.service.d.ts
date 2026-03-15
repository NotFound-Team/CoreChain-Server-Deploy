import { UsersService } from 'src/users/users.service';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { IUser } from 'src/users/users.interface';
import { UpdateWorkingHoursDto } from 'src/users/dto/update-user.dto';
import { TasksService } from 'src/tasks/tasks.service';
import { SalaryAdvanceDto } from './dto/salary-advance.dto';
import { Repository } from 'typeorm';
import { SalaryAdvance } from './entities/salary-advance.entity';
import { ISalaryAdvance } from './personnel.interface';
export declare class PersonnelService {
    private salaryAdvanceRepository;
    private userService;
    private taskService;
    constructor(salaryAdvanceRepository: Repository<SalaryAdvance>, userService: UsersService, taskService: TasksService);
    isValidId(id: string): boolean;
    calSalary(id: string, user: IUser): Promise<number>;
    salaryAdvance(salaryAdvanceDto: SalaryAdvanceDto, user: IUser): Promise<{
        message: string;
    }>;
    approveSalaryAdvance(user: IUser, id: string): Promise<{
        message: string;
    }>;
    findOne(id: string): Promise<ISalaryAdvance>;
    findAll(query: any): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: ISalaryAdvance[];
    }>;
    calKpi(id: string, user: IUser): Promise<number>;
    addAdjustments(id: string, updatePersonnelDto: UpdatePersonnelDto, user: IUser): Promise<import("../users/entities/user.entity").User>;
    updateWorkingHours(updateWorkingHoursDto: UpdateWorkingHoursDto, user: IUser, id: string): Promise<import("../users/entities/user.entity").User>;
}
