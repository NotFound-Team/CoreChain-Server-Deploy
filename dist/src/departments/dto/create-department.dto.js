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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDepartmentDto = void 0;
const class_validator_1 = require("class-validator");
const mongoose_1 = __importDefault(require("mongoose"));
class CreateDepartmentDto {
}
exports.CreateDepartmentDto = CreateDepartmentDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Name must not be empty !' }),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Department code must not be empty !' }),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Description must not be empty !' }),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)({ message: 'Manager ID must not be empty !' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", mongoose_1.default.Schema.Types.ObjectId)
], CreateDepartmentDto.prototype, "manager", void 0);
__decorate([
    (0, class_validator_1.IsOptional)({ message: 'Employees ID must not be empty !' }),
    (0, class_validator_1.IsMongoId)({ each: true }),
    __metadata("design:type", Array)
], CreateDepartmentDto.prototype, "employees", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Status must not be empty !' }),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Budget must not be empty !' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Budget is number' }),
    __metadata("design:type", Number)
], CreateDepartmentDto.prototype, "budget", void 0);
__decorate([
    (0, class_validator_1.IsOptional)({ message: 'ProjectIds must not be empty !' }),
    (0, class_validator_1.IsMongoId)({ each: true, message: 'ProjectIds has format mongo Id' }),
    __metadata("design:type", Array)
], CreateDepartmentDto.prototype, "projectIds", void 0);
//# sourceMappingURL=create-department.dto.js.map