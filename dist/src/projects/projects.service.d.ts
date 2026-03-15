import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { IUser } from 'src/users/users.interface';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { TasksService } from 'src/tasks/tasks.service';
import { IProject } from './project.interface';
import { DepartmentsService } from 'src/departments/departments.service';
export declare class ProjectsService {
    private projectRepository;
    private taskService;
    private departmentService;
    constructor(projectRepository: Repository<Project>, taskService: TasksService, departmentService: DepartmentsService);
    isValidId(id: string): boolean;
    progressCalculation(id: string): Promise<number>;
    create(createProjectDto: CreateProjectDto, user: IUser): Promise<string>;
    findAll(query: any): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: IProject[];
    }>;
    findOne(id: string): Promise<IProject>;
    update(id: string, updateProjectDto: UpdateProjectDto, user: IUser): Promise<Project>;
    remove(id: string, user: IUser): Promise<import("typeorm").UpdateResult>;
}
