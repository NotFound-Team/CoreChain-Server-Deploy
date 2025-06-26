import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    employee(): Promise<import("./report.interface").IEmployeesDepartment[]>;
    employeesTurnover(): Promise<import("./report.interface").IEmployeesTurnover>;
    workingHours(): Promise<import("./report.interface").IWorkingHours[]>;
    dayOff(): Promise<import("./report.interface").IDayOff[]>;
    kpi(): Promise<import("./report.interface").IKPI[]>;
    salary(): Promise<import("./report.interface").ISalary[]>;
    create(createReportDto: CreateReportDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateReportDto: UpdateReportDto): string;
    remove(id: string): string;
}
