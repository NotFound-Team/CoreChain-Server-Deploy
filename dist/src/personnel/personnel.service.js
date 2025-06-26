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
const mongoose_1 = require("@nestjs/mongoose");
const salary_advance_schema_1 = require("./schemas/salary-advance.schema");
const api_query_params_1 = __importDefault(require("api-query-params"));
const mongoose_2 = __importDefault(require("mongoose"));
let PersonnelService = class PersonnelService {
    constructor(salaryAdvanceModel, userService, taskService) {
        this.salaryAdvanceModel = salaryAdvanceModel;
        this.userService = userService;
        this.taskService = taskService;
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
            console.log(netSalary);
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
        const countSalaryAdvance = await this.salaryAdvanceModel.countDocuments({
            _id: user._id,
            isApproved: false,
        });
        if (amount <= 400 && countSalaryAdvance === 0) {
            await this.salaryAdvanceModel.create({
                employee: user._id,
                amount,
                reason,
                isApproved: true,
                approvedBy: 'System',
                returnDate,
            });
        }
        else {
            await this.salaryAdvanceModel.create({
                employee: user._id,
                amount,
                reason,
                returnDate,
                isApproved: false,
            });
        }
        return { message: 'Salary advance request successful !' };
    }
    async approveSalaryAdvance(user, id) {
        await this.salaryAdvanceModel.updateOne({ _id: id }, {
            isApproved: true,
            approvedBy: {
                _id: user._id,
                email: user.email,
            },
        });
        return { message: 'Approved salary advance !' };
    }
    async findOne(id) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid salary advance ID`);
        }
        return (await this.salaryAdvanceModel.findById(id));
    }
    async findAll(currentPage, limit, qs) {
        const { filter, skip, sort, projection, population } = (0, api_query_params_1.default)(qs);
        delete filter.current;
        delete filter.pageSize;
        filter.isDeleted = false;
        let offset = (+currentPage - 1) * +limit;
        let defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.salaryAdvanceModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);
        const result = await this.salaryAdvanceModel
            .find(filter)
            .skip(offset)
            .limit(defaultLimit)
            .sort(sort)
            .populate(population)
            .exec();
        return {
            meta: {
                current: currentPage,
                pageSize: limit,
                pages: totalPages,
                total: totalItems,
            },
            result,
        };
    }
    async calKpi(id, user) {
        try {
            const notCompleteTask = await this.taskService.countTaskInMonth(0, id);
            const completeTask = await this.taskService.countTaskInMonth(3, id);
            const kpi = (notCompleteTask / completeTask) * 100 || 0;
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
    __param(0, (0, mongoose_1.InjectModel)(salary_advance_schema_1.SalaryAdvance.name)),
    __metadata("design:paramtypes", [Object, users_service_1.UsersService,
        tasks_service_1.TasksService])
], PersonnelService);
//# sourceMappingURL=personnel.service.js.map