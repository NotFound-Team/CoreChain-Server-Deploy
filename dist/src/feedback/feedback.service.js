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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var FeedbackService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const feedback_schema_1 = require("./schemas/feedback.schema");
const security_service_1 = require("../security/security.service");
const api_query_params_1 = __importDefault(require("api-query-params"));
const mongoose_2 = __importDefault(require("mongoose"));
let FeedbackService = FeedbackService_1 = class FeedbackService {
    constructor(feedbackModel, encryptionService) {
        this.feedbackModel = feedbackModel;
        this.encryptionService = encryptionService;
        this.logger = new common_1.Logger(FeedbackService_1.name);
    }
    async createFeedback(createFeedbackDto) {
        const { category, title, content } = createFeedbackDto;
        const encryptedEmployeeId = this.encryptionService.encryptEmployeeId(createFeedbackDto.sender.toString());
        const newFeedback = await this.feedbackModel.create({
            encryptedEmployeeId,
            category,
            title,
            content,
            isFlagged: this.shouldFlagFeedback(createFeedbackDto.content),
        });
        return newFeedback._id;
    }
    shouldFlagFeedback(content) {
        const flagWords = [
            'threat', 'illegal', 'violence', 'harassment', 'bomb', 'kill', 'attack', 'murder', 'assault', 'shoot',
            'stab', 'hijack', 'terrorist', 'explode', 'gun', 'rifle', 'pistol', 'knife', 'rape', 'abuse', 'robbery',
            'kidnap', 'hostage', 'arson', 'strangle', 'torture', 'execute', 'decapitate', 'suicide', 'self-harm', 'cutting',
            'overdose', 'hanging', 'jump', 'slit', 'poison', 'suffocate', 'die alone', 'depressed', 'no way out', 'pedophile',
            'molest', 'trafficking', 'prostitution', 'slave', 'incest', 'grooming', 'exploitation', 'child abuse', 'blackmail',
            'porn', 'nude', 'xxx', 'sex', 'explicit', 'hardcore', 'strip', 'escort', 'onlyfans', 'camgirl', 'fetish', 'bdsm',
            'bestiality', 'necrophilia',
            'cocaine', 'heroin', 'meth', 'drug', 'weed', 'marijuana', 'ecstasy', 'overdose', 'smuggle', 'cartel', 'narcotic',
            'racist', 'homophobic', 'hate crime', 'lynch', 'ethnic cleansing', 'nazi', 'white supremacy', 'genocide', 'discrimination',
        ];
        return flagWords.some((word) => content.toLowerCase().includes(word));
    }
    async decryptEmployeeId(feedbackId, decryptRequest, user) {
        const feedback = await this.feedbackModel.findById(feedbackId);
        if (!feedback) {
            throw new Error('Feedback not found');
        }
        if (!decryptRequest.reason || decryptRequest.reason.length < 10) {
            throw new common_1.ForbiddenException('A detailed reason for decryption is required');
        }
        if (!decryptRequest.approvedBy || decryptRequest.approvedBy.length === 0) {
            throw new common_1.ForbiddenException('Decryption requires approval from a senior manager');
        }
        const decryptedId = this.encryptionService.decryptEmployeeId(feedback.encryptedEmployeeId, decryptRequest.secretKey);
        if (decryptedId === null) {
            throw new common_1.BadRequestException('Incorrect secret key !');
        }
        await this.feedbackModel.updateOne({ feedbackId }, {
            wasDecrypted: true,
            decryptionReason: decryptRequest.reason,
            approvedBy: decryptRequest.approvedBy,
            decryptedBy: {
                _id: user._id,
                email: user.email,
            },
        });
        this.logger.warn(`Employee ID for feedback ${feedbackId} was decrypted by ${user.name}`);
        return decryptedId;
    }
    async findAll(currentPage, limit, qs) {
        const { filter, skip, sort, projection, population } = (0, api_query_params_1.default)(qs);
        delete filter.current;
        delete filter.pageSize;
        filter.isDeleted = false;
        let offset = (+currentPage - 1) * +limit;
        let defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.feedbackModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);
        const result = await this.feedbackModel
            .find(filter)
            .skip(offset)
            .limit(defaultLimit)
            .sort(sort)
            .populate(population)
            .exec();
        return {
            meta: {
                current: currentPage,
                pageSize: limit,
                pages: totalPages,
                total: totalItems,
            },
            result,
        };
    }
    async findOne(id) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid feedback ID`);
        }
        return (await this.feedbackModel.findById(id));
    }
    async remove(id, user) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid feedback ID`);
        }
        await this.feedbackModel.updateOne({ _id: id }, {
            deletedBy: {
                _id: user._id,
                email: user.email,
            },
        });
        return this.feedbackModel.softDelete({ _id: id });
    }
};
exports.FeedbackService = FeedbackService;
exports.FeedbackService = FeedbackService = FeedbackService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(feedback_schema_1.Feedback.name)),
    __metadata("design:paramtypes", [Object, security_service_1.SecurityService])
], FeedbackService);
//# sourceMappingURL=feedback.service.js.map