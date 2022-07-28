"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eachDir = void 0;
const node_path_1 = __importDefault(require("node:path"));
const utils_1 = require("./utils");
async function eachDir(filename, cb) {
    const files = await (0, utils_1.getFiles)(filename);
    for (const filePath of files) {
        const src = node_path_1.default.join(filename, filePath);
        const file = await (0, utils_1.stat)(src);
        if (!file) {
            console.error('File not found ', src);
            continue;
        }
        // Depth first so we can rename the folder and not cause problems...
        if (file.isDirectory()) {
            await eachDir(src, cb);
        }
        // Call this last so we can rename the file if we want
        await cb({ folder: filename, filename: filePath, isDirectory: file.isDirectory() });
    }
}
exports.eachDir = eachDir;
//# sourceMappingURL=eachDir.js.map