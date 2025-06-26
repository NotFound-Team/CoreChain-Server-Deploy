import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { IUser } from 'src/users/users.interface';
import { ProjectDocument } from './schemas/project.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import { TasksService } from 'src/tasks/tasks.service';
import { IProject } from './project.interface';
export declare class ProjectsService {
    private projectModel;
    private taskService;
    constructor(projectModel: SoftDeleteModel<ProjectDocument>, taskService: TasksService);
    progressCalculation(id: string): Promise<number>;
    create(createProjectDto: CreateProjectDto, user: IUser): Promise<mongoose.Types.ObjectId>;
    findAll(currentPage: number, limit: number, qs: string): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        projects: IProject[];
    }>;
    findOne(id: string): Promise<IProject>;
    update(id: string, updateProjectDto: UpdateProjectDto, user: IUser): Promise<mongoose.UpdateWriteOpResult>;
    remove(id: string, user: IUser): Promise<{
        deleted: number;
    }>;
}
