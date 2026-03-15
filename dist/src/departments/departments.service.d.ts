import { CreateDepartmentDto } from './dto/create-department.dto';
import { IUser } from 'src/users/users.interface';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { IDepartment } from './department.interface';
export declare class DepartmentsService {
    private departmentRepository;
    constructor(departmentRepository: Repository<Department>);
    isValidId(id: string): boolean;
    create(createDepartmentDto: CreateDepartmentDto, user: IUser): Promise<string>;
    findAll(query: any): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: IDepartment[];
    }>;
    findOne(id: string): Promise<IDepartment>;
    update(id: string, updateDepartmentDto: any, user?: IUser): Promise<void>;
    remove(id: string, user: IUser): Promise<import("typeorm").UpdateResult>;
}
