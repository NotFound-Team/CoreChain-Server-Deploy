import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { IUser } from 'src/users/users.interface';
import { DepartmentDocument } from './schemas/department.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import { IDepartment } from './department.interface';
export declare class DepartmentsService {
    private departmentModel;
    constructor(departmentModel: SoftDeleteModel<DepartmentDocument>);
    create(createDepartmentDto: CreateDepartmentDto, user: IUser): Promise<mongoose.Types.ObjectId>;
    findAll(currentPage: number, limit: number, qs: string): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: IDepartment[];
    }>;
    findOne(id: string): Promise<IDepartment>;
    update(id: string, updateDepartmentDto: UpdateDepartmentDto, user: IUser): Promise<mongoose.UpdateWriteOpResult>;
    remove(id: string, user: IUser): Promise<{
        deleted: number;
    }>;
}
