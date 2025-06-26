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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const contract_schema_1 = require("./schemas/contract.schema");
const api_query_params_1 = __importDefault(require("api-query-params"));
const mongoose_2 = __importDefault(require("mongoose"));
let ContractsService = class ContractsService {
    constructor(contractModel) {
        this.contractModel = contractModel;
    }
    async create(createContractDto, user) {
        const isExist = await this.contractModel.findOne({
            contractCode: createContractDto.contractCode,
        });
        if (isExist) {
            throw new common_1.BadRequestException('Contract already exist !');
        }
        const newContract = await this.contractModel.create({
            ...createContractDto,
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        });
        return newContract._id;
    }
    async findAll(currentPage, limit, qs) {
        let { filter, skip, sort, projection, population = [] } = (0, api_query_params_1.default)(qs);
        delete filter.current;
        delete filter.pageSize;
        filter.isDeleted = false;
        let offset = (+currentPage - 1) * +limit;
        let defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.contractModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);
        population.push({ path: 'employee', select: 'name email' });
        const result = await this.contractModel
            .find(filter)
            .skip(offset)
            .limit(defaultLimit)
            .sort(sort)
            .populate(population)
            .exec();
        return {
            meta: {
                current: currentPage,
                pageSize: limit,
                pages: totalPages,
                total: totalItems,
            },
            result,
        };
    }
    async findOne(id) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid contract ID`);
        }
        return (await (await this.contractModel.findById(id)).populate({
            path: 'employee',
            select: 'name email',
        }));
    }
    async update(id, updateContractDto, user) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid contract ID`);
        }
        return this.contractModel.updateOne({ _id: id }, {
            ...updateContractDto,
            updatedBy: {
                _id: user._id,
                email: user.email,
            },
        });
    }
    async remove(id, user) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid contract ID`);
        }
        await this.contractModel.updateOne({ _id: id }, {
            deletedBy: {
                _id: id,
                email: user.email,
            },
        });
        return this.contractModel.softDelete({ _id: id });
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(contract_schema_1.Contract.name)),
    __metadata("design:paramtypes", [Object])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map