"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aqpTypeormConverter = aqpTypeormConverter;
const typeorm_1 = require("typeorm");
function aqpTypeormConverter(filter) {
    if (!filter || Object.keys(filter).length === 0)
        return {};
    const typeOrmWhere = {};
    for (const [key, value] of Object.entries(filter)) {
        if (value === null) {
            typeOrmWhere[key] = (0, typeorm_1.IsNull)();
            continue;
        }
        if (value instanceof RegExp) {
            typeOrmWhere[key] = (0, typeorm_1.Like)(`%${value.source}%`);
            continue;
        }
        if (typeof value === 'object' && !Array.isArray(value)) {
            const condition = {};
            for (const [operator, opValue] of Object.entries(value)) {
                switch (operator) {
                    case '$gt':
                        condition[key] = (0, typeorm_1.MoreThan)(opValue);
                        break;
                    case '$gte':
                        condition[key] = (0, typeorm_1.MoreThanOrEqual)(opValue);
                        break;
                    case '$lt':
                        condition[key] = (0, typeorm_1.LessThan)(opValue);
                        break;
                    case '$lte':
                        condition[key] = (0, typeorm_1.LessThanOrEqual)(opValue);
                        break;
                    case '$ne':
                        condition[key] = (0, typeorm_1.Not)(opValue);
                        break;
                    case '$in':
                        condition[key] = (0, typeorm_1.In)(opValue);
                        break;
                    case '$regex':
                        condition[key] = (0, typeorm_1.Like)(`%${opValue}%`);
                        break;
                    default:
                        condition[key] = opValue;
                        break;
                }
                Object.assign(typeOrmWhere, condition);
            }
        }
        else {
            typeOrmWhere[key] = value;
        }
    }
    return typeOrmWhere;
}
//# sourceMappingURL=aqp.util.js.map