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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonnelService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const customize_1 = require("../decorators/customize");
const tasks_service_1 = require("../tasks/tasks.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const salary_advance_entity_1 = require("./entities/salary-advance.entity");
const api_query_params_1 = __importDefault(require("api-query-params"));
const aqp_util_1 = require("../utils/aqp.util");
let PersonnelService = class PersonnelService {
    constructor(salaryAdvanceRepository, userService, taskService) {
        this.salaryAdvanceRepository = salaryAdvanceRepository;
        this.userService = userService;
        this.taskService = taskService;
    }
    isValidId(id) {
        return /^[0-9a-fA-F]{24}$/.test(id) || /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    }
    async calSalary(id, user) {
        try {
            const employee = await this.userService.findPrivateOne(id);
            const baseSalary = Math.ceil((employee.salary / (30 * customize_1.WORKING_HOURS_PER_DAY)) *
                employee.workingHours);
            const totalAdjustments = employee.adjustments
                .filter((adj) => new Date(adj.createdAt) >= customize_1.START_OF_MONTH &&
                new Date(adj.createdAt) <= customize_1.END_OF_MONTH)
                .reduce((total, adj) => total + adj.amount, 0);
            const netSalary = baseSalary + totalAdjustments + employee.allowances;
            employee.netSalary = netSalary;
            employee.workingHours = 0;
            await this.userService.update(employee, user, id);
            return netSalary;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async salaryAdvance(salaryAdvanceDto, user) {
        const { amount, reason, returnDate } = salaryAdvanceDto;
        const countSalaryAdvance = await this.salaryAdvanceRepository.count({
            where: {
                employee: { _id: user._id },
                isApproved: false,
                isDeleted: false
            }
        });
        if (amount <= 400 && countSalaryAdvance === 0) {
            const advance = this.salaryAdvanceRepository.create({
                employee: { _id: user._id },
                amount,
                reason,
                isApproved: true,
                approvedBy: 'System',
                returnDate,
            });
            await this.salaryAdvanceRepository.save(advance);
        }
        else {
            const advance = this.salaryAdvanceRepository.create({
                employee: { _id: user._id },
                amount,
                reason,
                returnDate,
                isApproved: false,
            });
            await this.salaryAdvanceRepository.save(advance);
        }
        return { message: 'Salary advance request successful !' };
    }
    async approveSalaryAdvance(user, id) {
        if (!this.isValidId(id))
            throw new common_1.BadRequestException(`Invalid salary advance ID`);
        const advance = await this.salaryAdvanceRepository.findOne({ where: { _id: id } });
        if (!advance)
            throw new common_1.BadRequestException(`Invalid salary advance ID`);
        advance.isApproved = true;
        advance.approvedBy = {
            _id: user._id,
            email: user.email,
        };
        await this.salaryAdvanceRepository.save(advance);
        return { message: 'Approved salary advance !' };
    }
    async findOne(id) {
        if (!this.isValidId(id)) {
            throw new common_1.BadRequestException(`Invalid salary advance ID`);
        }
        return (await this.salaryAdvanceRepository.findOne({ where: { _id: id } }));
    }
    async findAll(query) {
        const { filter, skip, limit, sort } = (0, api_query_params_1.default)(query);
        const convertedFilter = (0, aqp_util_1.aqpTypeormConverter)(filter);
        let defaultLimit = limit || 10;
        let offset = skip || 0;
        const currentPage = Math.floor(offset / defaultLimit) + 1;
        const [result, totalItems] = await this.salaryAdvanceRepository.findAndCount({
            skip: offset,
            take: defaultLimit,
            where: { isDeleted: false, ...convertedFilter },
            order: sort,
        });
        const totalPages = Math.ceil(totalItems / defaultLimit);
        return {
            meta: {
                current: currentPage,
                pageSize: defaultLimit,
                pages: totalPages,
                total: totalItems,
            },
            result: result,
        };
    }
    async calKpi(id, user) {
        try {
            const notCompleteTask = await this.taskService.countTaskInMonth(0, id);
            const completeTask = await this.taskService.countTaskInMonth(3, id);
            const kpi = completeTask ? (notCompleteTask / completeTask) * 100 : 0;
            const updateDto = { kpi: kpi };
            await this.userService.updatePublicUser(updateDto, user, id);
            return kpi;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async addAdjustments(id, updatePersonnelDto, user) {
        const employee = await this.userService.findPrivateOne(id);
        if (!employee.adjustments) {
            employee.adjustments = [];
        }
        updatePersonnelDto.adjustment.createdAt = new Date();
        employee.adjustments.push(updatePersonnelDto.adjustment);
        return this.userService.update(employee, user, id);
    }
    async updateWorkingHours(updateWorkingHoursDto, user, id) {
        return this.userService.updateWorkingHours(updateWorkingHoursDto, user, id);
    }
};
exports.PersonnelService = PersonnelService;
exports.PersonnelService = PersonnelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(salary_advance_entity_1.SalaryAdvance)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        tasks_service_1.TasksService])
], PersonnelService);
//# sourceMappingURL=personnel.service.js.map