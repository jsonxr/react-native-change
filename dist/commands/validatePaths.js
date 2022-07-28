"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePaths = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils/utils");
class ValidatePathsCommand {
    opts;
    paths;
    constructor(opts) {
        this.opts = opts;
        this.paths = (0, utils_1.iosRequiredPaths)(opts.current.name);
    }
    async execute() {
        for (const item of this.paths) {
            if (!(await promises_1.default.stat(path_1.default.join(this.opts.dir, item)))) {
                const warning = `Can't find an ios path or project. Make sure that the ios project path and property 'name' in app.json the same.`;
                throw new Error(warning);
            }
        }
    }
}
const validatePaths = async (opts) => {
    const paths = (0, utils_1.iosRequiredPaths)(opts.current.name);
    const command = new ValidatePathsCommand(opts);
    for (const item of paths) {
        if (!(await promises_1.default.stat(path_1.default.join(opts.dir, item)))) {
            const warning = `Can't find an ios path or project. Make sure that the ios project path and property 'name' in app.json the same.`;
            throw new Error(warning);
        }
    }
};
exports.validatePaths = validatePaths;
//# sourceMappingURL=validatePaths.js.map