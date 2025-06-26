import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { IUser } from 'src/users/users.interface';
import { ContractDocument } from './schemas/contract.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import { IContract } from './contract.interface';
export declare class ContractsService {
    private contractModel;
    constructor(contractModel: SoftDeleteModel<ContractDocument>);
    create(createContractDto: CreateContractDto, user: IUser): Promise<mongoose.Types.ObjectId>;
    findAll(currentPage: number, limit: number, qs: string): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: IContract[];
    }>;
    findOne(id: string): Promise<IContract>;
    update(id: string, updateContractDto: UpdateContractDto, user: IUser): Promise<mongoose.UpdateWriteOpResult>;
    remove(id: string, user: IUser): Promise<{
        deleted: number;
    }>;
}
