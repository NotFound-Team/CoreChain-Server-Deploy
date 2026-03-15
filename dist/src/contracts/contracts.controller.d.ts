import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { IUser } from 'src/users/users.interface';
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    create(createContractDto: CreateContractDto, user: IUser): Promise<string>;
    findAll(currentPage: string, limit: string): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: import("./contract.interface").IContract[];
    }>;
    findOne(id: string): Promise<import("./contract.interface").IContract>;
    update(id: string, updateContractDto: UpdateContractDto, user: IUser): Promise<import("./entities/contract.entity").Contract>;
    remove(id: string, user: IUser): Promise<import("typeorm").UpdateResult>;
}
