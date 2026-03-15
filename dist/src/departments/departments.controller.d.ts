import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { IUser } from 'src/users/users.interface';
export declare class DepartmentsController {
    private readonly departmentsService;
    constructor(departmentsService: DepartmentsService);
    create(createDepartmentDto: CreateDepartmentDto, user: IUser): Promise<string>;
    findAll(query: any): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: import("./department.interface").IDepartment[];
    }>;
    findOne(id: string): Promise<import("./department.interface").IDepartment>;
    update(id: string, updateDepartmentDto: UpdateDepartmentDto, user: IUser): Promise<void>;
    remove(id: string, user: IUser): Promise<import("typeorm").UpdateResult>;
}
