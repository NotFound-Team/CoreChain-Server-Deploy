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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("./entities/role.entity");
const customize_1 = require("../decorators/customize");
const api_query_params_1 = __importDefault(require("api-query-params"));
const aqp_util_1 = require("../utils/aqp.util");
let RolesService = class RolesService {
    constructor(roleRepository) {
        this.roleRepository = roleRepository;
    }
    async create(createRoleDto) {
        const { name, description, isActive, permissions } = createRoleDto;
        const existRole = await this.roleRepository.findOne({ where: { name } });
        if (existRole) {
            throw new common_1.BadRequestException('This role already exist !');
        }
        const permissionEntities = permissions?.map((id) => ({ _id: id })) || [];
        const newRole = this.roleRepository.create({
            name,
            description,
            isActive,
            permissions: permissionEntities,
        });
        const saved = await this.roleRepository.save(newRole);
        return saved._id;
    }
    async findAll(query) {
        const { filter, skip, limit, sort } = (0, api_query_params_1.default)(query);
        const convertedFilter = (0, aqp_util_1.aqpTypeormConverter)(filter);
        let defaultLimit = limit || 10;
        let offset = skip || 0;
        const currentPage = Math.floor(offset / defaultLimit) + 1;
        const [result, totalItems] = await this.roleRepository.findAndCount({
            skip: offset,
            take: defaultLimit,
            where: convertedFilter,
            order: sort,
            relations: ['permissions'],
        });
        const totalPages = Math.ceil(totalItems / defaultLimit);
        return {
            meta: {
                current: currentPage,
                pageSize: defaultLimit,
                pages: totalPages,
                total: totalItems,
            },
            result,
        };
    }
    async findOne(id) {
        const role = await this.roleRepository.findOne({
            where: { _id: id },
            relations: ['permissions'],
        });
        if (!role) {
            throw new common_1.BadRequestException(`Not found role with id=${id}`);
        }
        return role;
    }
    async update(id, updateRoleDto, user) {
        const role = await this.roleRepository.findOne({ where: { _id: id } });
        if (!role) {
            throw new common_1.BadRequestException(`Not found role with id=${id}`);
        }
        const { permissions, ...rest } = updateRoleDto;
        if (permissions) {
            role.permissions = permissions.map((pId) => ({ _id: pId }));
        }
        Object.assign(role, {
            ...rest,
            updatedBy: {
                _id: user._id,
                email: user.email,
            },
        });
        return await this.roleRepository.save(role);
    }
    async remove(id, user) {
        const foundRole = await this.roleRepository.findOne({ where: { _id: id } });
        if (!foundRole) {
            throw new common_1.BadRequestException(`Not found role with id=${id}`);
        }
        if (foundRole.name === customize_1.ADMIN_ROLE)
            throw new common_1.BadRequestException('Cannot delete admin role !');
        foundRole.deletedBy = {
            _id: user._id,
            email: user.email,
        };
        foundRole.isDeleted = true;
        await this.roleRepository.save(foundRole);
        return await this.roleRepository.softDelete({ _id: id });
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RolesService);
//# sourceMappingURL=roles.service.js.map