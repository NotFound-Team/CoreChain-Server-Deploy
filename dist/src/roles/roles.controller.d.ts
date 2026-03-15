import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/users.interface';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(createRoleDto: CreateRoleDto): Promise<string>;
    findAll(query: any): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: import("./entities/role.entity").Role[];
    }>;
    findOne(id: string): Promise<import("./role.interface").IRole>;
    update(id: string, updateRoleDto: UpdateRoleDto, user: IUser): Promise<import("./entities/role.entity").Role>;
    remove(id: string, user: IUser): Promise<import("typeorm").UpdateResult>;
}
