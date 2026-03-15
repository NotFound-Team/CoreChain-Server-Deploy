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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_entity_1 = require("./entities/project.entity");
const tasks_service_1 = require("../tasks/tasks.service");
const departments_service_1 = require("../departments/departments.service");
const api_query_params_1 = __importDefault(require("api-query-params"));
const aqp_util_1 = require("../utils/aqp.util");
let ProjectsService = class ProjectsService {
    constructor(projectRepository, taskService, departmentService) {
        this.projectRepository = projectRepository;
        this.taskService = taskService;
        this.departmentService = departmentService;
    }
    isValidId(id) {
        return /^[0-9a-fA-F]{24}$/.test(id) || /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    }
    async progressCalculation(id) {
        const taskCompleted = await this.taskService.countTask(3, id);
        const taskAmount = await this.taskService.countTask(0, id);
        if (!taskAmount)
            return 0;
        return (taskCompleted / taskAmount) * 100;
    }
    async create(createProjectDto, user) {
        const { name, description, department, manager, attachments = [], teamMembers = [], tasks = [], expenses = [], revenue, priority, status, startDate, endDate, actualEndDate, } = createProjectDto;
        const newProject = this.projectRepository.create({
            name, description, attachments, expenses, revenue,
            priority, status, startDate, endDate, actualEndDate,
            department: department ? { _id: department.toString() } : null,
            manager: manager ? { _id: manager.toString() } : null,
            teamMembers: teamMembers.map((id) => ({ _id: id.toString() })),
            tasks: tasks.map((id) => ({ _id: id.toString() })),
            createdBy: { _id: user._id, email: user.email },
        });
        const saved = await this.projectRepository.save(newProject);
        if (department) {
            const dept = await this.departmentService.findOne(department.toString());
            if (dept) {
                if (!dept.projectIds)
                    dept.projectIds = [];
                dept.projectIds.push(saved._id);
                await this.departmentService.update(department.toString(), { projectIds: dept.projectIds }, user);
            }
        }
        return saved._id;
    }
    async findAll(query) {
        const { filter, skip, limit, sort } = (0, api_query_params_1.default)(query);
        const convertedFilter = (0, aqp_util_1.aqpTypeormConverter)(filter);
        let defaultLimit = limit || 10;
        let offset = skip || 0;
        const currentPage = Math.floor(offset / defaultLimit) + 1;
        const whereClause = { isDeleted: false, ...convertedFilter };
        const [result, totalItems] = await this.projectRepository.findAndCount({
            skip: offset,
            take: defaultLimit,
            where: whereClause,
            order: sort,
            relations: ['tasks', 'manager', 'teamMembers'],
        });
        const totalPages = Math.ceil(totalItems / defaultLimit);
        const projects = result;
        const taskCompletedCounts = await Promise.all(projects.map((p) => this.taskService.countTask(3, p._id)));
        const taskTotalCounts = await Promise.all(projects.map((p) => this.taskService.countTask(0, p._id)));
        projects.forEach((project, index) => {
            const taskCompleted = taskCompletedCounts[index] || 0;
            const taskTotal = taskTotalCounts[index] || 1;
            project.progress = (taskCompleted / taskTotal) * 100;
        });
        return {
            meta: {
                current: currentPage,
                pageSize: defaultLimit,
                pages: totalPages,
                total: totalItems,
            },
            result: projects,
        };
    }
    async findOne(id) {
        if (!this.isValidId(id))
            throw new common_1.BadRequestException(`Invalid project ID`);
        const project = await this.projectRepository.findOne({
            where: { _id: id, isDeleted: false },
            relations: ['teamMembers', 'manager'],
        });
        if (project) {
            project.progress = await this.progressCalculation(id);
        }
        return project;
    }
    async update(id, updateProjectDto, user) {
        if (!this.isValidId(id))
            throw new common_1.BadRequestException(`Invalid project ID`);
        const project = await this.projectRepository.findOne({ where: { _id: id } });
        if (!project)
            throw new common_1.BadRequestException('Project not found');
        const progress = await this.progressCalculation(id);
        const { teamMembers, tasks, manager, department, ...rest } = updateProjectDto;
        if (teamMembers)
            project.teamMembers = teamMembers.map((mId) => ({ _id: mId.toString() }));
        if (tasks)
            project.tasks = tasks.map((tId) => ({ _id: tId.toString() }));
        if (manager)
            project.manager = { _id: manager.toString() };
        if (department)
            project.department = { _id: department.toString() };
        Object.assign(project, {
            ...rest,
            progress: progress,
            updatedBy: { _id: user._id, email: user.email },
        });
        return await this.projectRepository.save(project);
    }
    async remove(id, user) {
        if (!this.isValidId(id))
            throw new common_1.BadRequestException(`Invalid project ID`);
        const project = await this.projectRepository.findOne({ where: { _id: id } });
        if (!project)
            throw new common_1.BadRequestException('Project not found');
        project.deletedBy = { _id: user._id, email: user.email };
        project.isDeleted = true;
        project.deletedAt = new Date();
        await this.projectRepository.save(project);
        return await this.projectRepository.softDelete({ _id: id });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        tasks_service_1.TasksService,
        departments_service_1.DepartmentsService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map