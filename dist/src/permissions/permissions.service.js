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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const permission_entity_1 = require("./entities/permission.entity");
let PermissionsService = class PermissionsService {
    constructor(permissionRepository) {
        this.permissionRepository = permissionRepository;
    }
    async create(createPermissionDto, user) {
        const { name, apiPath, method, module } = createPermissionDto;
        const existPer = await this.permissionRepository.findOne({
            where: { apiPath, method },
        });
        if (existPer)
            throw new common_1.BadRequestException('This permission already exist !');
        const newPermission = this.permissionRepository.create({
            name,
            apiPath,
            method,
            module,
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        });
        const saved = await this.permissionRepository.save(newPermission);
        return saved._id;
    }
    async findAll(currentPage = 1, limit = 10) {
        let offset = (+currentPage - 1) * (+limit || 10);
        let defaultLimit = +limit || 10;
        const [result, totalItems] = await this.permissionRepository.findAndCount({
            skip: offset,
            take: defaultLimit,
        });
        const totalPages = Math.ceil(totalItems / defaultLimit);
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
        const permission = await this.permissionRepository.findOne({ where: { _id: id } });
        if (!permission) {
            throw new common_1.BadRequestException(`Not found permission with id=${id}`);
        }
        return permission;
    }
    async update(id, updatePermissionDto, user) {
        const permission = await this.permissionRepository.findOne({ where: { _id: id } });
        if (!permission) {
            throw new common_1.BadRequestException(`Not found permission with id=${id}`);
        }
        Object.assign(permission, {
            ...updatePermissionDto,
            updatedBy: {
                _id: user._id,
                email: user.email,
            },
        });
        return await this.permissionRepository.save(permission);
    }
    async remove(id, user) {
        const permission = await this.permissionRepository.findOne({ where: { _id: id } });
        if (!permission) {
            throw new common_1.BadRequestException(`Not found permission with id=${id}`);
        }
        permission.deletedBy = {
            _id: user._id,
            email: user.email,
        };
        permission.isDeleted = true;
        await this.permissionRepository.save(permission);
        return await this.permissionRepository.softDelete({ _id: id });
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map