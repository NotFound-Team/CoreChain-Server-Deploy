import { ConfigService } from '@nestjs/config';
export declare class RsaService {
    private readonly configService;
    private readonly privateKeyPath;
    private readonly publicKeyPath;
    private privateKey;
    private publicKey;
    constructor(configService: ConfigService);
    private initializeKeys;
    private readPrivateKeyFile;
    private readPublicKeyFile;
    generateKeyFiles(): void;
    private generateKeyPairRSA;
    encryptSecretKey(secretKey: string): string;
    decryptSecretKey(encryptedSecretKey: string): string;
}
