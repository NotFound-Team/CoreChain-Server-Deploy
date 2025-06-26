"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const departments_service_1 = require("../departments/departments.service");
const positions_service_1 = require("../positions/positions.service");
const customize_1 = require("../decorators/customize");
const personnel_service_1 = require("../personnel/personnel.service");
let ReportsService = class ReportsService {
    constructor(userService, departmentService, positionService, personnelService) {
        this.userService = userService;
        this.departmentService = departmentService;
        this.positionService = positionService;
        this.personnelService = personnelService;
    }
    async employeesReport() {
        const { result: departments } = await this.departmentService.findAll(1, 1000, '');
        const departmentReports = await Promise.all(departments.map(async (department) => {
            const employees = await this.userService.findByIds(department.employees.map((id) => id.toString()));
            return {
                department: department.name,
                employees: employees,
            };
        }));
        return departmentReports;
    }
    async employeesTurnover() {
        const startOfMonth = customize_1.START_OF_MONTH.toISOString();
        const endOfMonth = customize_1.END_OF_MONTH.toISOString();
        const resignedQs = `deletedAt>${startOfMonth}&deletedAt<${endOfMonth}&isDeleted=true`;
        const newQs = `createdAt>${startOfMonth}&createdAt<${endOfMonth}&isDeleted=false`;
        const resignedEmployees = (await this.userService.findAll(1, 1000, resignedQs)).result;
        const newEmployees = (await this.userService.findAll(1, 1000, newQs))
            .result;
        return {
            resignedEmployees,
            newEmployees,
        };
    }
    async workingHours() {
        const { result: departments } = await this.departmentService.findAll(1, 1000, '');
        const workingHoursReports = await Promise.all(departments.map(async (department) => {
            const employees = await this.userService.findByIds(department.employees.map((id) => id.toString()));
            const result = [];
            for (let empl of employees) {
                result.push({
                    _id: empl._id,
                    name: empl.name,
                    email: empl.email,
                    avatar: empl.avatar,
                    workingHours: empl.workingHours || 0,
                });
            }
            return {
                department: department.name,
                employees: result,
            };
        }));
        return workingHoursReports;
    }
    async dayOff() {
        const { result: departments } = await this.departmentService.findAll(1, 1000, '');
        const dayOffReports = await Promise.all(departments.map(async (department) => {
            const employees = await this.userService.findByIds(department.employees.map((id) => id.toString()));
            const result = [];
            for (let empl of employees) {
                result.push({
                    _id: empl._id,
                    name: empl.name,
                    email: empl.email,
                    avatar: empl.avatar,
                    dayOff: empl.dayOff || 0,
                });
            }
            return {
                department: department.name,
                employees: result,
            };
        }));
        return dayOffReports;
    }
    async kpi() {
        const { result: departments } = await this.departmentService.findAll(1, 1000, '');
        const KPIReports = await Promise.all(departments.map(async (department) => {
            const employees = await this.userService.findByIds(department.employees.map((id) => id.toString()));
            const result = [];
            for (let empl of employees) {
                if (!empl.kpi) {
                    await this.personnelService.calKpi(empl._id.toString(), customize_1.System);
                }
                result.push({
                    _id: empl._id,
                    name: empl.name,
                    email: empl.email,
                    avatar: empl.avatar,
                    kpi: empl.kpi || 0,
                });
            }
            result.sort((a, b) => b.kpi - a.kpi);
            return {
                department: department.name,
                employees: result,
            };
        }));
        return KPIReports;
    }
    async salary() {
        const { result: departments } = await this.departmentService.findAll(1, 1000, '');
        let amount = 0;
        const salaryReports = await Promise.all(departments.map(async (department) => {
            const employees = await this.userService.findByIds(department.employees.map((id) => id.toString()));
            const result = [];
            for (let empl of employees) {
                const privateEmpl = await this.userService.findPrivateOne(empl._id.toString());
                if (!privateEmpl.netSalary) {
                    privateEmpl.netSalary = await this.personnelService.calSalary(empl._id.toString(), customize_1.System);
                }
                amount += privateEmpl.netSalary;
                result.push({
                    _id: empl._id,
                    name: empl.name,
                    email: empl.email,
                    avatar: empl.avatar,
                    salary: privateEmpl.salary,
                    allowances: privateEmpl.allowances,
                    adjustments: privateEmpl.adjustments,
                    netSalary: privateEmpl.netSalary,
                });
            }
            return {
                department: department.name,
                employees: result,
                amount: amount,
            };
        }));
        return salaryReports;
    }
    create(createReportDto) {
        return 'This action adds a new report';
    }
    findAll() {
        return `This action returns all reports`;
    }
    findOne(id) {
        return `This action returns a #${id} report`;
    }
    update(id, updateReportDto) {
        return `This action updates a #${id} report`;
    }
    remove(id) {
        return `This action removes a #${id} report`;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        departments_service_1.DepartmentsService,
        positions_service_1.PositionsService,
        personnel_service_1.PersonnelService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map