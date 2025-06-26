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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const project_schema_1 = require("./schemas/project.schema");
const api_query_params_1 = __importDefault(require("api-query-params"));
const mongoose_2 = __importDefault(require("mongoose"));
const tasks_service_1 = require("../tasks/tasks.service");
let ProjectsService = class ProjectsService {
    constructor(projectModel, taskService) {
        this.projectModel = projectModel;
        this.taskService = taskService;
    }
    async progressCalculation(id) {
        const taskCompleted = await this.taskService.countTask(3, id);
        const taskAmount = await this.taskService.countTask(0, id);
        console.log(taskCompleted, taskAmount);
        return (taskCompleted / taskAmount) * 100;
    }
    async create(createProjectDto, user) {
        const { name, description, department, manager, attachments = [], teamMembers = [], tasks = [], expenses = [], revenue, priority, status, startDate, endDate, actualEndDate, } = createProjectDto;
        const newProject = await this.projectModel.create({
            name,
            description,
            department,
            manager,
            attachments,
            teamMembers,
            tasks,
            expenses,
            revenue,
            priority,
            status,
            startDate,
            endDate,
            actualEndDate,
        });
        return newProject._id;
    }
    async findAll(currentPage, limit, qs) {
        let { filter, skip, sort, projection, population = [] } = (0, api_query_params_1.default)(qs);
        delete filter.current;
        delete filter.pageSize;
        filter.isDeleted = false;
        let offset = (+currentPage - 1) * +limit;
        let defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.projectModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);
        population.push({ path: 'tasks', select: '_id name' });
        population.push({ path: 'manager', select: '_id name email' });
        population.push({ path: 'teamMembers', select: '_id name email' });
        const projects = await this.projectModel
            .find(filter)
            .skip(offset)
            .limit(defaultLimit)
            .sort(sort)
            .populate(population)
            .exec();
        const projectIds = projects.map((p) => p._id);
        const taskCompletedCounts = await Promise.all(projectIds.map((id) => this.taskService.countTask(3, id.toString())));
        const taskTotalCounts = await Promise.all(projectIds.map((id) => this.taskService.countTask(0, id.toString())));
        projects.forEach((project, index) => {
            const taskCompleted = taskCompletedCounts[index] || 0;
            const taskTotal = taskTotalCounts[index] || 1;
            project.progress = (taskCompleted / taskTotal) * 100;
        });
        return {
            meta: {
                current: currentPage,
                pageSize: limit,
                pages: totalPages,
                total: totalItems,
            },
            projects,
        };
    }
    async findOne(id) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid project ID`);
        }
        const project = await this.projectModel
            .findOne({ _id: id })
            .populate([
            { path: 'teamMembers', select: 'name email' },
            { path: 'manager', select: 'name email' },
        ])
            .lean();
        project.progress = await this.progressCalculation(id);
        return project;
    }
    async update(id, updateProjectDto, user) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid project ID`);
        }
        const progress = await this.progressCalculation(id);
        return this.projectModel.updateOne({ _id: id }, {
            progress: progress,
            ...updateProjectDto,
            updatedBy: {
                _id: user._id,
                email: user.email,
            },
        });
    }
    async remove(id, user) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid project ID`);
        }
        await this.projectModel.updateOne({ _id: id }, {
            deletedBy: {
                _id: user._id,
                email: user.email,
            },
        });
        return this.projectModel.softDelete({ _id: id });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_schema_1.Project.name)),
    __metadata("design:paramtypes", [Object, tasks_service_1.TasksService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map