import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import { IPermission } from './permission.interface';
export declare class PermissionsService {
    private permissionModel;
    constructor(permissionModel: SoftDeleteModel<PermissionDocument>);
    create(createPermissionDto: CreatePermissionDto, user: IUser): Promise<mongoose.Types.ObjectId>;
    findAll(currentPage: number, limit: number, qs: string): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: IPermission[];
    }>;
    findOne(id: string): Promise<IPermission>;
    update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser): Promise<mongoose.UpdateWriteOpResult>;
    remove(id: string, user: IUser): Promise<{
        deleted: number;
    }>;
}
