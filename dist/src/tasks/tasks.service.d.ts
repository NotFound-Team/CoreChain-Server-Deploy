import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { IUser } from 'src/users/users.interface';
import { ITask } from './task.interface';
import { NotificationService } from 'src/notification/notification.service';
import { UsersService } from 'src/users/users.service';
export declare class TasksService {
    private taskRepository;
    private notificationService;
    private usersService;
    constructor(taskRepository: Repository<Task>, notificationService: NotificationService, usersService: UsersService);
    isValidId(id: string): boolean;
    create(createTaskDto: CreateTaskDto, user: IUser): Promise<string>;
    private publishTaskCreatedEvent;
    countTask(status: number, id: string): Promise<number>;
    countTaskInMonth(status: number, id: string): Promise<number>;
    findAll(query: any): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: Task[];
    }>;
    findOne(id: string): Promise<ITask>;
    update(id: string, updateTaskDto: UpdateTaskDto, user: IUser): Promise<Task>;
    remove(id: string, user: IUser): Promise<import("typeorm").UpdateResult>;
}
