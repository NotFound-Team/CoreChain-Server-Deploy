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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("./entities/task.entity");
const customize_1 = require("../decorators/customize");
const notification_service_1 = require("../notification/notification.service");
const users_service_1 = require("../users/users.service");
const api_query_params_1 = __importDefault(require("api-query-params"));
const aqp_util_1 = require("../utils/aqp.util");
let TasksService = class TasksService {
    constructor(taskRepository, notificationService, usersService) {
        this.taskRepository = taskRepository;
        this.notificationService = notificationService;
        this.usersService = usersService;
    }
    isValidId(id) {
        return /^[0-9a-fA-F]{24}$/.test(id) || /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    }
    async create(createTaskDto, user) {
        const { description, title, attachments = [], assignedTo, projectId, priority, status, startDate, dueDate, } = createTaskDto;
        if (startDate && dueDate && new Date(startDate) > new Date(dueDate)) {
            throw new common_1.BadRequestException('Start date must be before due date');
        }
        const newTask = this.taskRepository.create({
            title, description, attachments, priority, status, startDate, dueDate,
            projectId: projectId?.toString(),
            assignedTo: assignedTo ? { _id: assignedTo.toString() } : null,
            createdBy: { _id: user._id, email: user.email },
        });
        const saved = await this.taskRepository.save(newTask);
        this.publishTaskCreatedEvent(saved, user).catch(error => {
            console.error('Failed to publish task.created event:', error);
        });
        return saved._id;
    }
    async publishTaskCreatedEvent(task, creator) {
        try {
            if (!task.assignedTo || !task.assignedTo._id)
                return;
            const assignedUser = await this.usersService.findOne(task.assignedTo._id);
            if (!assignedUser)
                return;
            const event = {
                event_type: 'task.created',
                timestamp: new Date().toISOString(),
                data: {
                    _id: task._id.toString(),
                    title: task.title,
                    description: task.description,
                    attachments: task.attachments,
                    createdBy: creator,
                    assignedTo: task.assignedTo._id.toString(),
                    projectId: task.projectId?.toString(),
                    priority: task.priority,
                    status: task.status,
                    startDate: task.startDate,
                    dueDate: task.dueDate,
                    isDeleted: task.isDeleted || false,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt,
                },
                metadata: {
                    assignedToUser: {
                        _id: assignedUser._id.toString(),
                        fcmToken: assignedUser.fcmToken || '',
                        name: assignedUser.name || '',
                        email: assignedUser.email,
                    },
                },
            };
            await this.notificationService.publishTaskCreated(event);
        }
        catch (error) {
            console.error('Error in publishTaskCreatedEvent:', error);
            throw error;
        }
    }
    async countTask(status, id) {
        if (status === 0) {
            return this.taskRepository.count({ where: { projectId: id } });
        }
        return this.taskRepository.count({ where: { status, projectId: id } });
    }
    async countTaskInMonth(status, id) {
        const qb = this.taskRepository.createQueryBuilder('task')
            .where('task.assignedToId = :id', { id })
            .andWhere('task.createdAt >= :start AND task.createdAt <= :end', { start: customize_1.START_OF_MONTH, end: customize_1.END_OF_MONTH });
        if (status !== 0)
            qb.andWhere('task.status = :status', { status });
        return qb.getCount();
    }
    async findAll(query) {
        const { filter, skip, limit, sort } = (0, api_query_params_1.default)(query);
        const convertedFilter = (0, aqp_util_1.aqpTypeormConverter)(filter);
        let defaultLimit = limit || 10;
        let offset = skip || 0;
        const currentPage = Math.floor(offset / defaultLimit) + 1;
        const [result, totalItems] = await this.taskRepository.findAndCount({
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
            result,
        };
    }
    async findOne(id) {
        if (!this.isValidId(id))
            throw new common_1.BadRequestException(`Invalid task ID`);
        return await this.taskRepository.findOne({ where: { _id: id } });
    }
    async update(id, updateTaskDto, user) {
        if (!this.isValidId(id))
            throw new common_1.BadRequestException(`Invalid task ID`);
        const task = await this.taskRepository.findOne({ where: { _id: id } });
        if (!task)
            throw new common_1.BadRequestException(`Invalid task ID`);
        const { assignedTo, projectId, ...rest } = updateTaskDto;
        if (assignedTo)
            task.assignedTo = { _id: assignedTo.toString() };
        if (projectId)
            task.projectId = projectId.toString();
        Object.assign(task, {
            ...rest,
            updatedBy: { _id: user._id, email: user.email },
        });
        return await this.taskRepository.save(task);
    }
    async remove(id, user) {
        if (!this.isValidId(id))
            throw new common_1.BadRequestException(`Invalid task ID`);
        const task = await this.taskRepository.findOne({ where: { _id: id } });
        if (!task)
            throw new common_1.BadRequestException(`Invalid task ID`);
        task.deletedBy = { _id: user._id, email: user.email };
        task.isDeleted = true;
        task.deletedAt = new Date();
        await this.taskRepository.save(task);
        return this.taskRepository.softDelete({ _id: id });
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notification_service_1.NotificationService,
        users_service_1.UsersService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map