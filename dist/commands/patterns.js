"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterPatterns = void 0;
const filterPatterns = (patterns) => patterns.filter(p => (typeof p.condition === 'undefined' ? p.matcher !== p.replace : p.condition));
exports.filterPatterns = filterPatterns;
//# sourceMappingURL=patterns.js.map