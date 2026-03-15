import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { IUser } from 'src/users/users.interface';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: CreateProjectDto, user: IUser): Promise<string>;
    findAll(query: any): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: import("./project.interface").IProject[];
    }>;
    findOne(id: string): Promise<import("./project.interface").IProject>;
    update(id: string, updateProjectDto: UpdateProjectDto, user: IUser): Promise<import("./entities/project.entity").Project>;
    remove(id: string, user: IUser): Promise<import("typeorm").UpdateResult>;
}
