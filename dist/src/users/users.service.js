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
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./schemas/user.schema");
const config_1 = require("@nestjs/config");
const bcryptjs_1 = require("bcryptjs");
const api_query_params_1 = __importDefault(require("api-query-params"));
const mongoose_2 = __importDefault(require("mongoose"));
const blockchain_service_1 = require("../blockchain/blockchain.service");
const security_service_1 = require("../security/security.service");
const departments_service_1 = require("../departments/departments.service");
const customize_1 = require("../decorators/customize");
const cache_manager_1 = require("@nestjs/cache-manager");
let UsersService = class UsersService {
    constructor(userModel, configService, blockchainService, securityService, departmentService, cacheManager) {
        this.userModel = userModel;
        this.configService = configService;
        this.blockchainService = blockchainService;
        this.securityService = securityService;
        this.departmentService = departmentService;
        this.cacheManager = cacheManager;
        this.getHashPassword = (password) => {
            const salt = (0, bcryptjs_1.genSaltSync)(10);
            const hash = (0, bcryptjs_1.hashSync)(password, salt);
            return hash;
        };
        this.getUserByToken = async (refreshToken) => {
            try {
                return await this.userModel.findOne({ refreshToken });
            }
            catch (error) {
                console.log(error);
            }
        };
        this.updateUserToken = async (refreshToken, _id) => {
            try {
                return await this.userModel
                    .updateOne({ _id }, {
                    refreshToken,
                })
                    .populate({
                    path: 'role',
                    select: { name: 1 },
                });
            }
            catch (error) {
                console.log(error);
            }
        };
        this.PRIVATE_FIELDS = [
            'netSalary',
            'personalIdentificationNumber',
            'dateOfBirth',
            'personalPhoneNumber',
            'male',
            'nationality',
            'permanentAddress',
            'biometricData',
            'employeeContractCode',
            'salary',
            'allowances',
            'adjustments',
            'healthCheckRecordCode',
            'medicalHistory',
            'healthInsuranceCode',
            'lifeInsuranceCode',
            'personalTaxIdentificationNumber',
            'socialInsuranceNumber',
            'backAccountNumber',
        ];
    }
    isValidPassword(password, hashPassword) {
        return (0, bcryptjs_1.compareSync)(password, hashPassword);
    }
    findOneByUsername(username) {
        return this.userModel
            .findOne({
            email: username,
        })
            .populate({ path: 'role', select: { name: 1 } });
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
        try {
            const { name, email, password, role, workingHours, position, department, } = createUserDto;
            const isExist = await this.userModel.findOne({ email });
            if (isExist) {
                throw new common_1.BadRequestException('Email already exist. Please use another email');
            }
            const hashPassword = this.getHashPassword(password);
            const employeeData = {};
            const txHash = await this.blockchainService.addEmployee(employeeData, createUserDto.employeeId);
            console.log(txHash);
            let newUser = await this.userModel.create({
                name,
                email,
                password: hashPassword,
                employeeId: createUserDto.employeeId,
                position,
                department,
                role,
                dayOff: 0,
                workingHours: workingHours || 0,
                txHash,
                createdBy: {
                    _id: user._id,
                    email: user.email,
                },
            });
            if (createUserDto.department) {
                const department = await this.departmentService.findOne(createUserDto.department.toString());
                department.employees.push(newUser._id);
                await this.departmentService.update(department._id.toString(), {
                    employees: department.employees,
                }, customize_1.System);
            }
            return newUser._id;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async findAll(currentPage, limit, qs) {
        let { filter, skip, sort, projection, population } = (0, api_query_params_1.default)(qs);
        delete filter.current;
        delete filter.pageSize;
        let offset = (+currentPage - 1) * +limit;
        let defaultLimit = +limit ? +limit : 10;
        const totalItems = await this.userModel.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / defaultLimit);
        if (!population)
            population = [];
        population.push({ path: 'role', select: '_id name' });
        population.push({ path: 'position', select: '_id title' });
        population.push({ path: 'department', select: '_id name' });
        const result = await this.userModel
            .find(filter)
            .select('-password -refreshToken')
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
            throw new common_1.BadRequestException(`Invalid user ID`);
        }
        const employee = (await this.userModel
            .findOne({
            _id: id,
            isDeleted: false,
        })
            .select('-password -refreshToken')
            .populate([
            { path: 'role', select: { name: 1, _id: 1 } },
            { path: 'position', select: '_id title' },
            { path: 'department', select: '_id name' },
        ])
            .lean());
        return employee;
    }
    async findByIds(ids) {
        if (!ids || ids.length === 0) {
            return [];
        }
        const invalidIds = ids.filter((id) => !mongoose_2.default.Types.ObjectId.isValid(id));
        if (invalidIds.length > 0) {
            throw new common_1.BadRequestException(`Invalid user IDs: ${invalidIds.join(', ')}`);
        }
        return await this.userModel
            .find({
            _id: { $in: ids },
            isDeleted: false,
        })
            .select('-password -refreshToken')
            .populate([
            { path: 'role', select: { name: 1, _id: 1 } },
            { path: 'position', select: '_id title' },
            { path: 'department', select: '_id name' },
        ]);
    }
    async findPrivateOne(id) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid user ID`);
        }
        const cachedEmployee = await this.getCached(id);
        if (cachedEmployee) {
            common_1.Logger.log('Got employee from cache !');
            return cachedEmployee;
        }
        else {
            const publicEmployee = await this.userModel
                .findById(id)
                .select('-password -refreshToken')
                .populate([
                { path: 'role', select: { name: 1, _id: 1 } },
                { path: 'position', select: '_id title' },
                { path: 'department', select: '_id name' },
            ])
                .lean();
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
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid user ID`);
        }
        const idExist = await this.userModel.findOne({
            _id: id,
        });
        if (!idExist)
            throw new common_1.BadRequestException('User not found !');
        let txHash;
        const { employeeId, privateData, publicData } = this.splitData(updateUserDto);
        console.log('Private Data: >>>>>>', privateData);
        console.log('Public Data: >>>>>>', publicData);
        if (Object.keys(privateData).length !== 0) {
            if (!employeeId) {
                throw new common_1.BadRequestException('Can not update. Must have employee ID !');
            }
            const updateData = {
                ...privateData,
            };
            try {
                txHash = await this.blockchainService.updateEmployee(updateData, employeeId);
                console.log(txHash);
            }
            catch (error) {
                throw error;
            }
        }
        const cachedEmployee = await this.getCached(id);
        if (cachedEmployee) {
            await this.delCached(id);
        }
        return await this.userModel.updateOne({
            _id: id,
        }, {
            ...publicData,
            txHash,
            updatedBy: {
                _id: user._id,
                email: user.email,
            },
        });
    }
    async updateWorkingHours(updateWorkingHoursDto, user, id) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid user ID`);
        }
        const idExist = await this.userModel.findOne({
            _id: id,
        });
        if (!idExist)
            throw new common_1.BadRequestException('User not found !');
        const empl = await this.findOne(id);
        return await this.userModel.updateOne({
            _id: id,
        }, {
            workingHours: empl.workingHours + updateWorkingHoursDto.workingHours,
            updatedBy: {
                _id: user._id,
                email: user.email,
            },
        });
    }
    async updatePublicUser(updatePublicUserDto, user, id) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid user ID`);
        }
        const idExist = await this.userModel.findOne({
            _id: id,
        });
        if (!idExist)
            throw new common_1.BadRequestException('User not found !');
        const emailExist = await this.userModel.findOne({
            email: updatePublicUserDto.email,
        });
        if (emailExist && emailExist.id !== id)
            throw new common_1.BadRequestException('Email already exist !');
        if (updatePublicUserDto.department) {
            const employee = await this.userModel.findOne({ _id: id }).lean();
            console.log(employee);
            const department = await this.departmentService.findOne(employee.department.toString());
            department.employees = department.employees.filter((empId) => empId.toString() !== employee._id.toString());
            await this.departmentService.update(department._id.toString(), {
                employees: department.employees,
            }, customize_1.System);
            const newDepartment = await this.departmentService.findOne(updatePublicUserDto.department.toString());
            newDepartment.employees.push(employee._id);
            await this.departmentService.update(newDepartment._id.toString(), {
                employees: newDepartment.employees,
            }, user);
        }
        return this.userModel.updateOne({ _id: id }, {
            updatedBy: {
                _id: user._id,
                email: user.email,
            },
            ...updatePublicUserDto,
        });
    }
    async changePassword(updatePassword, thisUser) {
        const { id, oldPassword, newPassword } = updatePassword;
        const user = await this.userModel.findOne({ _id: id });
        if (thisUser._id !== user._id.toString()) {
            throw new common_1.BadRequestException('You only change your password !');
        }
        if (!user) {
            throw new common_1.BadRequestException('User Not Found !');
        }
        if (!this.isValidPassword(oldPassword, user.password)) {
            throw new common_1.BadRequestException('Password is Incorrect !');
        }
        else {
            await this.userModel.updateOne({ _id: id }, { password: this.getHashPassword(newPassword) });
            return 'Update Password Successfully !';
        }
    }
    async remove(id, user) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid user ID`);
        }
        const foundUser = await this.userModel.findById(id);
        const ADMIN_EMAIL = this.configService.get('ADMIN_EMAIL');
        if (foundUser && foundUser.email === ADMIN_EMAIL)
            throw new common_1.BadRequestException('Cannot delete admin account !');
        await this.userModel.updateOne({ _id: id }, {
            deletedBy: {
                _id: user._id,
                email: user.email,
            },
        });
        const employee = await this.userModel
            .findOne({ _id: id })
            .select('employeeId');
        console.log(employee);
        await this.blockchainService.deactivateEmployee(employee.employeeId);
        return this.userModel.softDelete({
            _id: id,
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(5, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, config_1.ConfigService,
        blockchain_service_1.BlockchainService,
        security_service_1.SecurityService,
        departments_service_1.DepartmentsService, Object])
], UsersService);
//# sourceMappingURL=users.service.js.map