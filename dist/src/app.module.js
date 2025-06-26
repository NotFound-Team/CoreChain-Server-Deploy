"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const soft_delete_plugin_mongoose_1 = require("soft-delete-plugin-mongoose");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const throttler_1 = require("@nestjs/throttler");
const blockchain_module_1 = require("./blockchain/blockchain.module");
const chat_module_1 = require("./chat/chat.module");
const ws_module_1 = require("./ws/ws.module");
const security_module_1 = require("./security/security.module");
const roles_module_1 = require("./roles/roles.module");
const permissions_module_1 = require("./permissions/permissions.module");
const departments_module_1 = require("./departments/departments.module");
const projects_module_1 = require("./projects/projects.module");
const tasks_module_1 = require("./tasks/tasks.module");
const feedback_module_1 = require("./feedback/feedback.module");
const positions_module_1 = require("./positions/positions.module");
const files_module_1 = require("./files/files.module");
const contracts_module_1 = require("./contracts/contracts.module");
const personnel_module_1 = require("./personnel/personnel.module");
const reports_module_1 = require("./reports/reports.module");
const cache_module_1 = require("./cache/cache.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGO_URL'),
                    connectionFactory: (connection) => {
                        connection.plugin(soft_delete_plugin_mongoose_1.softDeletePlugin);
                        return connection;
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        limit: 10,
                        ttl: 60 * 1000,
                    },
                ],
            }),
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            blockchain_module_1.BlockchainModule,
            ws_module_1.WsModule,
            chat_module_1.ChatModule,
            security_module_1.SecurityModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            departments_module_1.DepartmentsModule,
            projects_module_1.ProjectsModule,
            tasks_module_1.TasksModule,
            feedback_module_1.FeedbackModule,
            positions_module_1.PositionsModule,
            files_module_1.FilesModule,
            contracts_module_1.ContractsModule,
            personnel_module_1.PersonnelModule,
            reports_module_1.ReportsModule,
            cache_module_1.RedisCacheModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map