"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clean_all = void 0;
const colors_1 = __importDefault(require("colors"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
async function deleteFile(filePath, dryrun) {
    if (!dryrun) {
        await promises_1.default.rm(filePath, { recursive: true, force: true });
    }
    console.log(`${colors_1.default.red('DELETED')} ${filePath}`);
}
const clean = async (opts, paths) => {
    const promises = [];
    for (const filename of paths) {
        const filePath = path_1.default.join(opts.dir, filename);
        if (!(await (0, utils_1.stat)(filePath))) {
            continue;
        }
        promises.push(deleteFile(filePath, opts.dryrun));
    }
    if (promises.length > 0) {
        await Promise.all(promises);
        console.log(colors_1.default.green(`Done removing ${promises.length} folders.\n`));
    }
};
async function clean_all(opts) {
    await clean(opts, ['ios/build', 'ios/Pods', 'android/.gradle', 'android/app/build', 'android/build']);
}
exports.clean_all = clean_all;
//# sourceMappingURL=clean_all.js.map