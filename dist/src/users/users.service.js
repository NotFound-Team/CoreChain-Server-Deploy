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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const config_1 = require("@nestjs/config");
const bcryptjs_1 = require("bcryptjs");
const blockchain_service_1 = require("../blockchain/blockchain.service");
const security_service_1 = require("../security/security.service");
const departments_service_1 = require("../departments/departments.service");
const customize_1 = require("../decorators/customize");
const cache_manager_1 = require("@nestjs/cache-manager");
const api_query_params_1 = __importDefault(require("api-query-params"));
const aqp_util_1 = require("../utils/aqp.util");
let UsersService = class UsersService {
    constructor(userRepository, dataSource, configService, blockchainService, securityService, departmentService, cacheManager) {
        this.userRepository = userRepository;
        this.dataSource = dataSource;
        this.configService = configService;
        this.blockchainService = blockchainService;
        this.securityService = securityService;
        this.departmentService = departmentService;
        this.cacheManager = cacheManager;
        this.getHashPassword = (password) => {
            const salt = (0, bcryptjs_1.genSaltSync)(10);
            return (0, bcryptjs_1.hashSync)(password, salt);
        };
        this.getUserByToken = async (refreshToken) => {
            try {
                return await this.userRepository.findOne({ where: { refreshToken } });
            }
            catch (error) {
                console.log(error);
            }
        };
        this.updateUserToken = async (refreshToken, _id) => {
            try {
                await this.userRepository.update(_id, { refreshToken });
                return await this.userRepository.findOne({ where: { _id }, relations: ['role'] });
            }
            catch (error) {
                console.log(error);
            }
        };
        this.PRIVATE_FIELDS = [
            'netSalary', 'personalIdentificationNumber', 'dateOfBirth', 'personalPhoneNumber',
            'male', 'nationality', 'permanentAddress', 'biometricData', 'employeeContractCode',
            'salary', 'allowances', 'adjustments', 'healthCheckRecordCode', 'medicalHistory',
            'healthInsuranceCode', 'lifeInsuranceCode', 'personalTaxIdentificationNumber',
            'socialInsuranceNumber', 'backAccountNumber',
        ];
    }
    isValidId(id) {
        return /^[0-9a-fA-F]{24}$/.test(id) || /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    }
    isValidPassword(password, hashPassword) {
        return (0, bcryptjs_1.compareSync)(password, hashPassword);
    }
    findOneByUsername(username) {
        return this.userRepository.findOne({
            where: { email: username, isDeleted: false },
            relations: ['role'],
        });
    }
    splitData(updateUserDto) {
        const publicData = {};
        const privateData = {};
        let employeeId;
        for (const [key, value] of Object.entries(updateUserDto)) {
            if (this.PRIVATE_FIELDS.includes(key)) {
                privateData[key] = value;
            }
            else {
                publicData[key] = value;
            }
            if (key === 'employeeId') {
                employeeId = value;
            }
        }
        return { employeeId, privateData, publicData };
    }
    async setCached(id, data) {
        await this.cacheManager.set(`employee:${id}`, data);
    }
    async getCached(id) {
        return (await this.cacheManager.get(`employee:${id}`));
    }
    async delCached(id) {
        await this.cacheManager.del(`employee:${id}`);
    }
    async create(createUserDto, user) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const isExist = await queryRunner.manager.findOne(user_entity_1.User, { where: { email: createUserDto.email } });
            if (isExist)
                throw new common_1.BadRequestException('Email already exists');
            const hashPassword = this.getHashPassword(createUserDto.password);
            const { employeeId, privateData, publicData } = this.splitData(createUserDto);
            const newUser = queryRunner.manager.create(user_entity_1.User, {
                ...publicData,
                password: hashPassword,
                createdBy: { _id: user._id, email: user.email },
            });
            const savedUser = await queryRunner.manager.save(newUser);
            if (createUserDto.department) {
                const department = await this.departmentService.findOne(createUserDto.department.toString());
                if (department) {
                    if (!department.employees)
                        department.employees = [];
                    department.employees.push(savedUser._id);
                    await this.departmentService.update(department._id.toString(), { employees: department.employees }, customize_1.System);
                }
            }
            try {
                const txHash = await this.blockchainService.addEmployee(privateData, employeeId);
                await queryRunner.manager.update(user_entity_1.User, savedUser._id, { txHash });
            }
            catch (blockchainError) {
                throw new Error('Blockchain transaction failed: ' + blockchainError.message);
            }
            await queryRunner.commitTransaction();
            return savedUser._id;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.BadRequestException(error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(query) {
        const { filter, skip, limit, sort } = (0, api_query_params_1.default)(query);
        const convertedFilter = (0, aqp_util_1.aqpTypeormConverter)(filter);
        let defaultLimit = limit || 10;
        let offset = skip || 0;
        const currentPage = Math.floor(offset / defaultLimit) + 1;
        const [result, totalItems] = await this.userRepository.findAndCount({
            skip: offset,
            take: defaultLimit,
            where: { isDeleted: false, ...convertedFilter },
            order: sort,
            relations: ['role', 'position', 'department'],
        });
        const totalPages = Math.ceil(totalItems / defaultLimit);
        return {
            meta: {
                current: currentPage,
                pageSize: defaultLimit,
                pages: totalPages,
                total: totalItems,
            },
            result: result.map(u => {
                const { password, refreshToken, ...publicUser } = u;
                return publicUser;
            }),
        };
    }
    async findAllByIds(ids) {
        if (!ids || ids.length === 0)
            return [];
        const invalidIds = ids.filter((id) => !this.isValidId(id));
        if (invalidIds.length > 0)
            throw new common_1.BadRequestException(`Invalid user IDs: ${invalidIds.join(', ')}`);
        const users = await this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'role')
            .leftJoinAndSelect('user.position', 'position')
            .leftJoinAndSelect('user.department', 'department')
            .where('user._id IN (:...ids)', { ids })
            .andWhere('user.isDeleted = :isDeleted', { isDeleted: false })
            .getMany();
        return users.map(u => {
            const { password, refreshToken, ...publicUser } = u;
            return publicUser;
        });
    }
    async findOnePublic(id) {
        if (!this.isValidId(id))
            throw new common_1.BadRequestException(`Invalid user ID`);
        const user = await this.userRepository.findOne({
            where: { _id: id, isDeleted: false },
            select: ['_id', 'name', 'avatar'],
        });
        return user;
    }
    async findOne(id) {
        if (!this.isValidId(id))
            throw new common_1.BadRequestException(`Invalid user ID`);
        const user = await this.userRepository.findOne({
            where: { _id: id, isDeleted: false },
            relations: ['role', 'position', 'department'],
        });
        if (user) {
            const { password, refreshToken, ...publicUser } = user;
            return publicUser;
        }
        return null;
    }
    async findByIds(ids) {
        return this.findAllByIds(ids);
    }
    async findPrivateOne(id) {
        if (!this.isValidId(id))
            throw new common_1.BadRequestException(`Invalid user ID`);
        const cachedEmployee = await this.getCached(id);
        if (cachedEmployee) {
            common_1.Logger.log('Got employee from cache !');
            return cachedEmployee;
        }
        else {
            const publicEmployee = await this.findOne(id);
            if (!publicEmployee)
                throw new common_1.BadRequestException('User not found');
            const privateEmployee = await this.blockchainService.getEmployee(publicEmployee.employeeId);
            const employee = {
                ...publicEmployee,
                ...privateEmployee,
            };
            await this.setCached(id, employee);
            common_1.Logger.log('Cached This Employee');
            return employee;
        }
    }
    async update(updateUserDto, user, id) {
        if (!this.isValidId(id))
            throw new common_1.BadRequestException(`Invalid user ID`);
        const idExist = await this.userRepository.findOne({ where: { _id: id } });
        if (!idExist)
            throw new common_1.BadRequestException('User not found !');
        if (idExist.employeeId !== updateUserDto.employeeId) {
            throw new common_1.BadRequestException('You cannot update employee ID !');
        }
        let txHash;
        const { employeeId, privateData, publicData } = this.splitData(updateUserDto);
        if (Object.keys(privateData).length !== 0) {
            if (!employeeId)
                throw new common_1.BadRequestException('Can not update. Must have employee ID !');
            try {
                txHash = await this.blockchainService.updateEmployee(privateData, employeeId);
            }
            catch (error) {
                throw error;
            }
        }
        const relationsToUpdate = {};
        if (publicData.role)
            relationsToUpdate.role = { _id: publicData.role };
        if (publicData.department)
            relationsToUpdate.department = { _id: publicData.department };
        if (publicData.position)
            relationsToUpdate.position = { _id: publicData.position };
        Object.assign(idExist, {
            ...publicData,
            ...relationsToUpdate,
            txHash: txHash || idExist.txHash,
            updatedBy: { _id: user._id, email: user.email },
        });
        await this.userRepository.save(idExist);
        const cachedEmployee = await this.getCached(id);
        if (cachedEmployee) {
            await this.delCached(id);
        }
        return idExist;
    }
    async updateWorkingHours(updateWorkingHoursDto, user, id) {
        if (!this.isValidId(id))
            throw new common_1.BadRequestException(`Invalid user ID`);
        const idExist = await this.userRepository.findOne({ where: { _id: id } });
        if (!idExist)
            throw new common_1.BadRequestException('User not found !');
        idExist.workingHours += updateWorkingHoursDto.workingHours;
        idExist.updatedBy = { _id: user._id, email: user.email };
        return await this.userRepository.save(idExist);
    }
    async updatePublicUser(updatePublicUserDto, user, id) {
        if (!this.isValidId(id))
            throw new common_1.BadRequestException(`Invalid user ID`);
        const idExist = await this.userRepository.findOne({ where: { _id: id } });
        if (!idExist)
            throw new common_1.BadRequestException('User not found !');
        if (updatePublicUserDto.email) {
            const emailExist = await this.userRepository.findOne({ where: { email: updatePublicUserDto.email } });
            if (emailExist && emailExist._id !== id)
                throw new common_1.BadRequestException('Email already exist !');
        }
        const relationsToUpdate = {};
        if (updatePublicUserDto.department)
            relationsToUpdate.department = { _id: updatePublicUserDto.department };
        Object.assign(idExist, {
            ...updatePublicUserDto,
            ...relationsToUpdate,
            updatedBy: { _id: user._id, email: user.email },
        });
        return await this.userRepository.save(idExist);
    }
    async updateFcmToken(userId, fcmToken) {
        if (!this.isValidId(userId))
            throw new common_1.BadRequestException(`Invalid user ID`);
        const user = await this.userRepository.findOne({ where: { _id: userId } });
        if (!user)
            throw new common_1.BadRequestException('User not found');
        user.fcmToken = fcmToken;
        await this.userRepository.save(user);
        return { message: 'FCM token updated successfully', userId: userId };
    }
    async changePassword(updatePassword, thisUser) {
        const { id, oldPassword, newPassword } = updatePassword;
        const user = await this.userRepository.findOne({ where: { _id: id } });
        if (thisUser._id !== user?._id)
            throw new common_1.BadRequestException('You only change your password !');
        if (!user)
            throw new common_1.BadRequestException('User Not Found !');
        if (!this.isValidPassword(oldPassword, user.password || '')) {
            throw new common_1.BadRequestException('Password is Incorrect !');
        }
        user.password = this.getHashPassword(newPassword);
        await this.userRepository.save(user);
        return 'Update Password Successfully !';
    }
    async remove(id, user) {
        if (!this.isValidId(id))
            throw new common_1.BadRequestException(`Invalid user ID`);
        const foundUser = await this.userRepository.findOne({ where: { _id: id } });
        if (!foundUser)
            throw new common_1.BadRequestException('User not found');
        const ADMIN_EMAIL = this.configService.get('ADMIN_EMAIL');
        if (foundUser.email === ADMIN_EMAIL)
            throw new common_1.BadRequestException('Cannot delete admin account !');
        foundUser.deletedBy = { _id: user._id, email: user.email };
        foundUser.isDeleted = true;
        foundUser.deletedAt = new Date();
        await this.userRepository.save(foundUser);
        try {
            await this.blockchainService.deactivateEmployee(foundUser.employeeId);
        }
        catch (e) {
            common_1.Logger.error(e);
        }
        return foundUser;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(6, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        config_1.ConfigService,
        blockchain_service_1.BlockchainService,
        security_service_1.SecurityService,
        departments_service_1.DepartmentsService, Object])
], UsersService);
//# sourceMappingURL=users.service.js.map