"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const rsa_service_1 = require("./security/rsa.service");
async function encryptSecret() {
    const configService = new config_1.ConfigService();
    const rsaService = new rsa_service_1.RsaService(configService);
    const secretKey = configService.get('SECRET_KEY');
    console.log(secretKey);
    if (!secretKey) {
        console.error('SECRET_KEY is not defined in .env file');
        process.exit(1);
    }
    const encryptedSecretKey = rsaService.encryptSecretKey(secretKey);
    console.log('Encrypted SECRET_KEY:');
    console.log(encryptedSecretKey);
    console.log('\nAdd this to your .env file as:');
    console.log(`ENCRYPTED_SECRET_KEY=${encryptedSecretKey}`);
}
encryptSecret();
//# sourceMappingURL=encrypt-secret.js.map