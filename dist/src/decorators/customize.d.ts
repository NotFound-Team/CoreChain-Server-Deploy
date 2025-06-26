import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { IUser } from 'src/users/users.interface';
export declare const IS_PUBLIC_KEY = "isPublic";
export declare const Public: () => import("@nestjs/common").CustomDecorator<string>;
export declare const User: (...dataOrPipes: unknown[]) => ParameterDecorator;
export declare const IS_PUBLIC_PERMISSION = "isPublicPermission";
export declare const SkipCheckPermission: () => import("@nestjs/common").CustomDecorator<string>;
export declare const RESPONSE_MESSAGE = "response_message";
export declare const ADMIN_ROLE = "ADMIN";
export declare const USER_ROLE = "USER";
export declare const WORKING_HOURS_PER_DAY = 8;
export declare const START_OF_MONTH: Date;
export declare const END_OF_MONTH: Date;
export declare const System: IUser;
export declare class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
}
