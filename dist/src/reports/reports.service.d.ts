import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { UsersService } from 'src/users/users.service';
import { DepartmentsService } from 'src/departments/departments.service';
import { PositionsService } from 'src/positions/positions.service';
import { PersonnelService } from 'src/personnel/personnel.service';
import { IDayOff, IEmployeesDepartment, IEmployeesTurnover, IKPI, ISalary, IWorkingHours } from './report.interface';
export declare class ReportsService {
    private readonly userService;
    private readonly departmentService;
    private readonly positionService;
    private readonly personnelService;
    constructor(userService: UsersService, departmentService: DepartmentsService, positionService: PositionsService, personnelService: PersonnelService);
    employeesReport(): Promise<IEmployeesDepartment[]>;
    employeesTurnover(): Promise<IEmployeesTurnover>;
    workingHours(): Promise<IWorkingHours[]>;
    dayOff(): Promise<IDayOff[]>;
    kpi(): Promise<IKPI[]>;
    salary(): Promise<ISalary[]>;
    create(createReportDto: CreateReportDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateReportDto: UpdateReportDto): string;
    remove(id: number): string;
}
