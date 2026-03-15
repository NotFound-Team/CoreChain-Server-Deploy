import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { IPermission } from './permission.interface';
export declare class PermissionsService {
    private permissionRepository;
    constructor(permissionRepository: Repository<Permission>);
    create(createPermissionDto: CreatePermissionDto, user: IUser): Promise<string>;
    findAll(currentPage?: number, limit?: number): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: Permission[];
    }>;
    findOne(id: string): Promise<IPermission>;
    update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser): Promise<Permission>;
    remove(id: string, user: IUser): Promise<import("typeorm").UpdateResult>;
}
