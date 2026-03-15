"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contract_entity_1 = require("./entities/contract.entity");
let ContractsService = class ContractsService {
    constructor(contractRepository) {
        this.contractRepository = contractRepository;
    }
    isValidId(id) {
        return /^[0-9a-fA-F]{24}$/.test(id) || /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    }
    async create(createContractDto, user) {
        const isExist = await this.contractRepository.findOne({
            where: { contractCode: createContractDto.contractCode },
        });
        if (isExist) {
            throw new common_1.BadRequestException('Contract already exist !');
        }
        const newContract = this.contractRepository.create({
            ...createContractDto,
            employee: { _id: createContractDto.employee?.toString() },
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        });
        const saved = await this.contractRepository.save(newContract);
        return saved._id;
    }
    async findAll(currentPage = 1, limit = 10) {
        let offset = (+currentPage - 1) * (+limit || 10);
        let defaultLimit = +limit || 10;
        const [result, totalItems] = await this.contractRepository.findAndCount({
            skip: offset,
            take: defaultLimit,
            where: { isDeleted: false },
            relations: ['employee'],
        });
        const totalPages = Math.ceil(totalItems / defaultLimit);
        return {
            meta: {
                current: currentPage,
                pageSize: limit,
                pages: totalPages,
                total: totalItems,
            },
            result: result,
        };
    }
    async findOne(id) {
        if (!this.isValidId(id))
            throw new common_1.BadRequestException(`Invalid contract ID`);
        const contract = await this.contractRepository.findOne({
            where: { _id: id, isDeleted: false },
            relations: ['employee'],
        });
        return contract;
    }
    async update(id, updateContractDto, user) {
        if (!this.isValidId(id))
            throw new common_1.BadRequestException(`Invalid contract ID`);
        const contract = await this.contractRepository.findOne({ where: { _id: id } });
        if (!contract)
            throw new common_1.BadRequestException(`Invalid contract ID`);
        const { employee, ...rest } = updateContractDto;
        if (employee)
            contract.employee = { _id: employee.toString() };
        Object.assign(contract, {
            ...rest,
            updatedBy: {
                _id: user._id,
                email: user.email,
            },
        });
        return await this.contractRepository.save(contract);
    }
    async remove(id, user) {
        if (!this.isValidId(id))
            throw new common_1.BadRequestException(`Invalid contract ID`);
        const contract = await this.contractRepository.findOne({ where: { _id: id } });
        if (!contract)
            throw new common_1.BadRequestException(`Invalid contract ID`);
        contract.deletedBy = {
            _id: user._id,
            email: user.email,
        };
        contract.isDeleted = true;
        contract.deletedAt = new Date();
        await this.contractRepository.save(contract);
        return this.contractRepository.softDelete({ _id: id });
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contract_entity_1.Contract)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map