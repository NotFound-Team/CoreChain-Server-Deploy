import { ConfigService } from '@nestjs/config';
import { RsaService } from './rsa.service';
export declare class SecurityService {
    private configService;
    private rsaService;
    private secretKey;
    private readonly algorithm;
    private readonly key;
    private readonly iv;
    constructor(configService: ConfigService, rsaService: RsaService);
    encryptEmployeeId(employeeId: string): string;
    decryptEmployeeId(encryptedId: string, secretKey: string): string;
    encrypt(data: any): string;
    decrypt(ciphertext: any): any;
}
