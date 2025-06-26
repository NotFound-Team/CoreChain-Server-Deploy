import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import { IRole } from './role.interface';
export declare class RolesService {
    private roleModel;
    constructor(roleModel: SoftDeleteModel<RoleDocument>);
    create(createRoleDto: CreateRoleDto): Promise<mongoose.Types.ObjectId>;
    findAll(currentPage: number, limit: number, qs: string): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: IRole[];
    }>;
    findOne(id: string): Promise<IRole>;
    update(id: string, updateRoleDto: UpdateRoleDto, user: IUser): Promise<mongoose.UpdateWriteOpResult>;
    remove(id: string, user: IUser): Promise<{
        deleted: number;
    }>;
}
