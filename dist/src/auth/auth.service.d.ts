import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../users/users.interface';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RolesService } from 'src/roles/roles.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    private rolesService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, rolesService: RolesService);
    validateUser(username: string, pass: string): Promise<any>;
    login(user: IUser, response: Response): Promise<{
        access_token: string;
        user: {
            _id: string;
            name: string;
            email: string;
            role: {
                _id: string;
                name: string;
            };
            permissions: {
                _id: string;
                name: string;
                apiPath: string;
                module: string;
            }[];
        };
    }>;
    createRefreshToken: (payload: any) => string;
    processNewToken: (refreshToken: string, response: Response) => Promise<{
        access_token: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            role: import("mongoose").Schema.Types.ObjectId;
            permissions: import("mongoose").Schema.Types.ObjectId[];
        };
    }>;
    logout(response: Response, user: IUser): Promise<string>;
}
