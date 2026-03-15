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
var FeedbackService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const feedback_entity_1 = require("./entities/feedback.entity");
const security_service_1 = require("../security/security.service");
let FeedbackService = FeedbackService_1 = class FeedbackService {
    constructor(feedbackRepository, encryptionService) {
        this.feedbackRepository = feedbackRepository;
        this.encryptionService = encryptionService;
        this.logger = new common_1.Logger(FeedbackService_1.name);
    }
    isValidId(id) {
        return /^[0-9a-fA-F]{24}$/.test(id) || /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    }
    async createFeedback(createFeedbackDto) {
        const { category, title, content } = createFeedbackDto;
        const encryptedEmployeeId = this.encryptionService.encryptEmployeeId(createFeedbackDto.sender.toString());
        const newFeedback = this.feedbackRepository.create({
            encryptedEmployeeId,
            category,
            title,
            content,
            isFlagged: this.shouldFlagFeedback(createFeedbackDto.content),
        });
        const saved = await this.feedbackRepository.save(newFeedback);
        return saved._id;
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
        if (!this.isValidId(feedbackId))
            throw new common_1.BadRequestException(`Invalid feedback ID`);
        const feedback = await this.feedbackRepository.findOne({ where: { _id: feedbackId } });
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
        feedback.wasDecrypted = true;
        feedback.decryptionReason = decryptRequest.reason;
        feedback.approvedBy = decryptRequest.approvedBy;
        feedback.decryptedBy = {
            _id: user._id,
            email: user.email,
        };
        await this.feedbackRepository.save(feedback);
        this.logger.warn(`Employee ID for feedback ${feedbackId} was decrypted by ${user.name}`);
        return decryptedId;
    }
    async findAll(currentPage = 1, limit = 10) {
        let offset = (+currentPage - 1) * (+limit || 10);
        let defaultLimit = +limit || 10;
        const [result, totalItems] = await this.feedbackRepository.findAndCount({
            skip: offset,
            take: defaultLimit,
            where: { isDeleted: false },
        });
        const totalPages = Math.ceil(totalItems / defaultLimit);
        return {
            meta: {
                current: currentPage,
                pageSize: limit,
                pages: totalPages,
                total: totalItems,
            },
            result: result,
        };
    }
    async findOne(id) {
        if (!this.isValidId(id)) {
            throw new common_1.BadRequestException(`Invalid feedback ID`);
        }
        return (await this.feedbackRepository.findOne({ where: { _id: id } }));
    }
    async remove(id, user) {
        if (!this.isValidId(id)) {
            throw new common_1.BadRequestException(`Invalid feedback ID`);
        }
        const feedback = await this.feedbackRepository.findOne({ where: { _id: id } });
        if (!feedback)
            throw new common_1.BadRequestException(`Invalid feedback ID`);
        feedback.deletedBy = {
            _id: user._id,
            email: user.email,
        };
        feedback.isDeleted = true;
        feedback.deletedAt = new Date();
        await this.feedbackRepository.save(feedback);
        return this.feedbackRepository.softDelete({ _id: id });
    }
};
exports.FeedbackService = FeedbackService;
exports.FeedbackService = FeedbackService = FeedbackService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(feedback_entity_1.Feedback)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        security_service_1.SecurityService])
], FeedbackService);
//# sourceMappingURL=feedback.service.js.map