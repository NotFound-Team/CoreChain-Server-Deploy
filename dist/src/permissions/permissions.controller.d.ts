import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    create(createPermissionDto: CreatePermissionDto, user: IUser): Promise<string>;
    findAll(currentPage: string, limit: string): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: import("./entities/permission.entity").Permission[];
    }>;
    findOne(id: string): Promise<import("./permission.interface").IPermission>;
    update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser): Promise<import("./entities/permission.entity").Permission>;
    remove(id: string, user: IUser): Promise<import("typeorm").UpdateResult>;
}
