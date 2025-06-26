"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = exports.System = exports.END_OF_MONTH = exports.START_OF_MONTH = exports.WORKING_HOURS_PER_DAY = exports.USER_ROLE = exports.ADMIN_ROLE = exports.RESPONSE_MESSAGE = exports.SkipCheckPermission = exports.IS_PUBLIC_PERMISSION = exports.User = exports.Public = exports.IS_PUBLIC_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.IS_PUBLIC_KEY = 'isPublic';
const Public = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true);
exports.Public = Public;
exports.User = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
exports.IS_PUBLIC_PERMISSION = 'isPublicPermission';
const SkipCheckPermission = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC_PERMISSION, true);
exports.SkipCheckPermission = SkipCheckPermission;
exports.RESPONSE_MESSAGE = 'response_message';
exports.ADMIN_ROLE = 'ADMIN';
exports.USER_ROLE = 'USER';
exports.WORKING_HOURS_PER_DAY = 8;
exports.START_OF_MONTH = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
exports.END_OF_MONTH = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);
exports.System = {
    _id: 'System',
    name: 'System',
    email: 'System',
    role: {
        _id: 'System',
        name: 'SUPER_ADMIN',
    },
};
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception instanceof common_1.HttpException ? exception.getStatus() : 500;
        let message;
        if (exception instanceof common_1.HttpException) {
            message = exception.getResponse();
        }
        else if (exception instanceof Error) {
            message = exception.message;
        }
        else {
            message = 'Internal Server Error';
        }
        console.log(exception);
        response.status(status).json({
            statusCode: status,
            message: message,
            timestamp: new Date().toISOString(),
        });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=customize.js.map