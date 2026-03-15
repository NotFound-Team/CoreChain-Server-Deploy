import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { IUser } from 'src/users/users.interface';
import { IRole } from './role.interface';
export declare class RolesService {
    private roleRepository;
    constructor(roleRepository: Repository<Role>);
    create(createRoleDto: CreateRoleDto): Promise<string>;
    findAll(query: any): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: Role[];
    }>;
    findOne(id: string): Promise<IRole>;
    update(id: string, updateRoleDto: UpdateRoleDto, user: IUser): Promise<Role>;
    remove(id: string, user: IUser): Promise<import("typeorm").UpdateResult>;
}
