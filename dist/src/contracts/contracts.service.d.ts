import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { IUser } from 'src/users/users.interface';
import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { IContract } from './contract.interface';
export declare class ContractsService {
    private contractRepository;
    constructor(contractRepository: Repository<Contract>);
    isValidId(id: string): boolean;
    create(createContractDto: CreateContractDto, user: IUser): Promise<string>;
    findAll(currentPage?: number, limit?: number): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: IContract[];
    }>;
    findOne(id: string): Promise<IContract>;
    update(id: string, updateContractDto: UpdateContractDto, user: IUser): Promise<Contract>;
    remove(id: string, user: IUser): Promise<import("typeorm").UpdateResult>;
}
