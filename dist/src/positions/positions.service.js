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
exports.PositionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const position_entity_1 = require("./entities/position.entity");
const api_query_params_1 = __importDefault(require("api-query-params"));
const aqp_util_1 = require("../utils/aqp.util");
let PositionsService = class PositionsService {
    constructor(positionRepository) {
        this.positionRepository = positionRepository;
    }
    isValidId(id) {
        return /^[0-9a-fA-F]{24}$/.test(id) || /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    }
    async create(createPositionDto, user) {
        const { title, description, parentId, level } = createPositionDto;
        const isExist = await this.positionRepository.findOne({ where: { title } });
        if (isExist) {
            throw new common_1.BadRequestException('Position already exist !');
        }
        const newPosition = this.positionRepository.create({
            title,
            description,
            parentId,
            level,
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        });
        const saved = await this.positionRepository.save(newPosition);
        return saved._id;
    }
    async findAll(query) {
        const { filter, skip, limit, sort } = (0, api_query_params_1.default)(query);
        const convertedFilter = (0, aqp_util_1.aqpTypeormConverter)(filter);
        let defaultLimit = limit || 10;
        let offset = skip || 0;
        const currentPage = Math.floor(offset / defaultLimit) + 1;
        const [result, totalItems] = await this.positionRepository.findAndCount({
            skip: offset,
            take: defaultLimit,
            where: { isDeleted: false, ...convertedFilter },
            order: sort,
        });
        const totalPages = Math.ceil(totalItems / defaultLimit);
        return {
            meta: {
                current: currentPage,
                pageSize: defaultLimit,
                pages: totalPages,
                total: totalItems,
            },
            result: result,
        };
    }
    async findOne(id) {
        if (!this.isValidId(id)) {
            throw new common_1.BadRequestException(`Invalid position ID`);
        }
        return (await this.positionRepository.findOne({ where: { _id: id } }));
    }
    async update(id, updatePositionDto, user) {
        if (!this.isValidId(id)) {
            throw new common_1.BadRequestException(`Invalid position ID`);
        }
        const pos = await this.positionRepository.findOne({ where: { _id: id } });
        if (!pos)
            throw new common_1.BadRequestException(`Invalid position ID`);
        Object.assign(pos, {
            ...updatePositionDto,
            updatedBy: {
                _id: user._id,
                email: user.email,
            },
        });
        return await this.positionRepository.save(pos);
    }
    async remove(id, user) {
        if (!this.isValidId(id)) {
            throw new common_1.BadRequestException(`Invalid position ID`);
        }
        const pos = await this.positionRepository.findOne({ where: { _id: id } });
        if (!pos)
            throw new common_1.BadRequestException(`Invalid position ID`);
        pos.updatedBy = {
            _id: user._id,
            email: user.email,
        };
        pos.isDeleted = true;
        pos.deletedAt = new Date();
        await this.positionRepository.save(pos);
        return await this.positionRepository.softDelete({ _id: id });
    }
};
exports.PositionsService = PositionsService;
exports.PositionsService = PositionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(position_entity_1.Position)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PositionsService);
//# sourceMappingURL=positions.service.js.map