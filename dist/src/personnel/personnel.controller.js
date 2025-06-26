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
exports.PersonnelController = void 0;
const common_1 = require("@nestjs/common");
const personnel_service_1 = require("./personnel.service");
const update_personnel_dto_1 = require("./dto/update-personnel.dto");
const customize_1 = require("../decorators/customize");
const update_user_dto_1 = require("../users/dto/update-user.dto");
const salary_advance_dto_1 = require("./dto/salary-advance.dto");
let PersonnelController = class PersonnelController {
    constructor(personnelService) {
        this.personnelService = personnelService;
    }
    calculateSalary(id, user) {
        return this.personnelService.calSalary(id, user);
    }
    salaryAdvance(salaryAdvanceDto, user) {
        return this.personnelService.salaryAdvance(salaryAdvanceDto, user);
    }
    approveSalaryAdvance(user, id) {
        return this.personnelService.approveSalaryAdvance(user, id);
    }
    findOne(id) {
        return this.personnelService.findOne(id);
    }
    findAll(currentPage, limit, qs) {
        return this.personnelService.findAll(+currentPage, +limit, qs);
    }
    calculateKpi(id, user) {
        return this.personnelService.calKpi(id, user);
    }
    addAdjustments(id, updatePersonnelDto, user) {
        return this.personnelService.addAdjustments(id, updatePersonnelDto, user);
    }
    updateWorkingHours(updateWorkingHoursDto, id, user) {
        return this.personnelService.updateWorkingHours(updateWorkingHoursDto, user, id);
    }
};
exports.PersonnelController = PersonnelController;
__decorate([
    (0, common_1.Get)('salary/calculate/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "calculateSalary", null);
__decorate([
    (0, common_1.Post)('salary'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [salary_advance_dto_1.SalaryAdvanceDto, Object]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "salaryAdvance", null);
__decorate([
    (0, common_1.Post)('salary/approve/:id'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "approveSalaryAdvance", null);
__decorate([
    (0, common_1.Get)('salary/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('salary'),
    __param(0, (0, common_1.Query)('current')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('kpi/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "calculateKpi", null);
__decorate([
    (0, common_1.Post)('adjustments/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_personnel_dto_1.UpdatePersonnelDto, Object]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "addAdjustments", null);
__decorate([
    (0, common_1.Patch)('working-hours/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_dto_1.UpdateWorkingHoursDto, String, Object]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "updateWorkingHours", null);
exports.PersonnelController = PersonnelController = __decorate([
    (0, common_1.Controller)('personnel'),
    __metadata("design:paramtypes", [personnel_service_1.PersonnelService])
], PersonnelController);
//# sourceMappingURL=personnel.controller.js.map