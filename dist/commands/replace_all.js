"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replace_all = exports.replace_commands = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const eachDir_1 = require("../utils/eachDir");
const patterns_1 = require("./patterns");
const colors_1 = __importDefault(require("colors"));
async function replace(dir, { dryrun, patterns }) {
    let count = 0;
    await (0, eachDir_1.eachDir)(dir, async ({ folder, filename, isDirectory }) => {
        if (isDirectory) {
            return;
        }
        const filePath = path_1.default.join(folder, filename);
        let text = await promises_1.default.readFile(filePath, { encoding: 'utf-8' });
        let changed = false;
        // 2) search/replace pattern
        for (const pattern of patterns) {
            if (text.match(pattern.matcher)) {
                text = text.replaceAll(pattern.matcher, pattern.replace);
                changed = true;
                count = count + 1;
            }
        }
        // 3) Save the file if it changed
        if (changed) {
            if (!dryrun) {
                await promises_1.default.writeFile(filePath, text, { encoding: 'utf-8' });
            }
            console.log(colors_1.default.yellow('MODIFY'), filePath);
        }
    });
    return count;
}
async function replace_commands(dryrun, commands) {
    let count = 0;
    for (const command of commands) {
        const patterns = (0, patterns_1.filterPatterns)(command.patterns);
        if (patterns.length > 0) {
            // Iterate over the paths first to minimize the open/close of files
            for (const filePath of command.paths) {
                let replaced = await replace(path_1.default.join(command.dir, filePath), {
                    dryrun,
                    patterns,
                });
                count += replaced;
            }
        }
    }
    return count;
}
exports.replace_commands = replace_commands;
async function replace_all(opts) {
    console.log(colors_1.default.green('search/replace in files...'));
    const srcBundlePath = opts.current.bundle.replaceAll('.', '/'); // com/mobile
    const destBundlePath = opts.future.bundle.replaceAll('.', '/'); // com/example/mymobile
    const count = await replace_commands(opts.dryrun, [
        {
            dir: opts.dir,
            paths: ['ios', 'android', 'app.json', 'package.json'],
            patterns: [
                // com/mobile -> com/example/mymobile (2 files)
                {
                    matcher: srcBundlePath,
                    replace: destBundlePath,
                },
                // com.mobile -> com.example.mymobile (11 files)
                {
                    matcher: opts.current.bundle,
                    replace: opts.future.bundle,
                },
                // mobile2_appmodules -> mymobile_appmodules (3 files)
                {
                    matcher: `${opts.current.name.toLocaleLowerCase()}_appmodules`,
                    replace: `${opts.future.name.toLocaleLowerCase()}_appmodules`,
                },
                // ([^\.^\/])Mobile2 -> $1MyMobile (11 files)
                {
                    condition: opts.current.name !== opts.future.name,
                    matcher: new RegExp('([^\\.^\\/])' + opts.current.name, 'g'),
                    replace: '$1' + opts.future.name,
                },
            ],
        },
    ]);
    if (count > 0) {
        console.log(colors_1.default.green(`modified ${count} files\n`));
    }
}
exports.replace_all = replace_all;
//# sourceMappingURL=replace_all.js.map