import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { IUser } from 'src/users/users.interface';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(createTaskDto: CreateTaskDto, user: IUser): Promise<string>;
    findAll(query: any): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: import("./entities/task.entity").Task[];
    }>;
    findOne(id: string): Promise<import("./task.interface").ITask>;
    update(id: string, updateTaskDto: UpdateTaskDto, user: IUser): Promise<import("./entities/task.entity").Task>;
    remove(id: string, user: IUser): Promise<import("typeorm").UpdateResult>;
}
