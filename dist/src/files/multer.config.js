"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MulterConfigService = void 0;
const common_1 = require("@nestjs/common");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
let MulterConfigService = class MulterConfigService {
    constructor() {
        this.getRootPath = () => {
            return process.cwd();
        };
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_KEY,
            api_secret: process.env.CLOUD_SECRET,
        });
    }
    createMulterOptions() {
        return {
            storage: new multer_storage_cloudinary_1.CloudinaryStorage({
                cloudinary: cloudinary_1.v2,
                params: {
                    folder: 'files',
                    public_id: (req, file) => {
                        const folderType = req.headers?.folder_type || 'default';
                        const baseName = path_1.default.basename(file.originalname, path_1.default.extname(file.originalname));
                        return `${folderType}/${baseName}-${Date.now()}`;
                    },
                    resource_type: 'auto',
                    access_mode: 'public',
                },
            }),
            fileFilter: (req, file, cb) => {
                const allowedFileTypes = [
                    'jpg',
                    'jpeg',
                    'png',
                    'gif',
                    'pdf',
                    'doc',
                    'docx',
                ];
                const fileExtension = file.originalname.split('.').pop().toLowerCase();
                const isValidFileType = allowedFileTypes.includes(fileExtension);
                if (!isValidFileType) {
                    cb(new common_1.HttpException('Invalid file type', common_1.HttpStatus.UNPROCESSABLE_ENTITY), null);
                }
                else {
                    cb(null, true);
                }
            },
            limits: {
                fileSize: 1024 * 1024 * 10,
            },
        };
    }
};
exports.MulterConfigService = MulterConfigService;
exports.MulterConfigService = MulterConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MulterConfigService);
//# sourceMappingURL=multer.config.js.map