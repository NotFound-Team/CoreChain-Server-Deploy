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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const api_query_params_1 = __importDefault(require("api-query-params"));
const mongoose_1 = require("@nestjs/mongoose");
const task_schema_1 = require("./schemas/task.schema");
const mongoose_2 = __importDefault(require("mongoose"));
const customize_1 = require("../decorators/customize");
let TasksService = class TasksService {
    constructor(taskModel) {
        this.taskModel = taskModel;
    }
    async create(createTaskDto, user) {
        const { name, description, title, attachments = [], assignedTo, projectId, priority, status, startDate, dueDate, } = createTaskDto;
        const newTask = await this.taskModel.create({
            createdBy: {
                _id: user._id,
                email: user.email,
            },
            name,
            title,
            description,
            attachments,
            assignedTo,
            projectId,
            priority,
            status,
            startDate,
            dueDate,
        });
        return newTask._id;
    }
    async countTask(status, id) {
        if (status === 0) {
            return this.taskModel.countDocuments({
                projectId: new mongoose_2.default.Types.ObjectId(id),
            });
        }
        return this.taskModel.countDocuments({
            status,
            projectId: new mongoose_2.default.Types.ObjectId(id),
        });
    }
    async countTaskInMonth(status, id) {
        if (status === 0) {
            return await this.taskModel.countDocuments({
                assignedTo: id,
                createdAt: { $gte: customize_1.START_OF_MONTH, $lte: customize_1.END_OF_MONTH },
            });
        }
        return await this.taskModel.countDocuments({
            assignedTo: id,
            status,
            createdAt: { $gte: customize_1.START_OF_MONTH, $lte: customize_1.END_OF_MONTH },
        });
    }
    async findAll(currentPage, limit, qs) {
        let { filter, skip, sort, projection, population = [] } = (0, api_query_params_1.default)(qs);
        delete filter.current;
        delete filter.pageSize;
        filter.isDeleted = false;
        let offset = (+currentPage - 1) * +limit;
        let defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.taskModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);
        const result = await this.taskModel
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
    async findOne(id) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid task ID`);
        }
        const task = await this.taskModel.findOne({ _id: id }).lean();
        return task;
    }
    async update(id, updateTaskDto, user) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid task ID`);
        }
        return this.taskModel.updateOne({ _id: id }, {
            ...updateTaskDto,
            updatedBy: {
                _id: user._id,
                email: user.email,
            },
        });
    }
    async remove(id, user) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid task ID`);
        }
        await this.taskModel.updateOne({
            _id: id,
        }, {
            deletedBy: {
                _id: user._id,
                email: user.email,
            },
        });
        return this.taskModel.softDelete({ _id: id });
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __metadata("design:paramtypes", [Object])
], TasksService);
//# sourceMappingURL=tasks.service.js.map