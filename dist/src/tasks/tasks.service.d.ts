import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskDocument } from './schemas/task.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import { ITask } from './task.interface';
import { NotificationService } from 'src/notification/notification.service';
import { UsersService } from 'src/users/users.service';
export declare class TasksService {
    private taskModel;
    private notificationService;
    private usersService;
    constructor(taskModel: SoftDeleteModel<TaskDocument>, notificationService: NotificationService, usersService: UsersService);
    create(createTaskDto: CreateTaskDto, user: IUser): Promise<mongoose.Types.ObjectId>;
    private publishTaskCreatedEvent;
    countTask(status: number, id: string): Promise<number>;
    countTaskInMonth(status: number, id: string): Promise<number>;
    findAll(currentPage: number, limit: number, qs: string): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: ITask[];
    }>;
    findOne(id: string): Promise<ITask>;
    update(id: string, updateTaskDto: UpdateTaskDto, user: IUser): Promise<mongoose.UpdateWriteOpResult>;
    remove(id: string, user: IUser): Promise<{
        deleted: number;
    }>;
}
