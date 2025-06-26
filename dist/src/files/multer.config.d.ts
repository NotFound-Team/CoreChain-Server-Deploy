import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
export declare class MulterConfigService implements MulterOptionsFactory {
    constructor();
    getRootPath: () => string;
    createMulterOptions(): MulterModuleOptions;
}
