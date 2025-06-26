import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';
import { UsersService } from 'src/users/users.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private rolesService;
    private userService;
    constructor(configService: ConfigService, rolesService: RolesService, userService: UsersService);
    validate(payload: IUser): Promise<{
        _id: string;
        name: string;
        email: string;
        role: {
            _id: string;
            name: string;
        };
        permissions: import("mongoose").Schema.Types.ObjectId[];
        employeeId: string;
    }>;
}
export {};
