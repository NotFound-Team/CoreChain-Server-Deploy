const fs = require('fs');
const privateKeyPEM = ``;
const publicKeyPEM = ``;
const privateKeyBase64 = Buffer.from(privateKeyPEM).toString('base64');
const publicKeyBase64 = Buffer.from(publicKeyPEM).toString('base64');
console.log('RSA_PRIVATE_KEY:');
console.log(privateKeyBase64);
console.log('\nRSA_PUBLIC_KEY:');
console.log(publicKeyBase64);
console.log('\nBase64 encoded keys have been saved to files for easy copying');
//# sourceMappingURL=encrypt-keys.js.map