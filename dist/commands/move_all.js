"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.move_all = exports.move_commands = exports.move = void 0;
const colors_1 = __importDefault(require("colors"));
const promises_1 = __importDefault(require("fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const eachDir_1 = require("../utils/eachDir");
const patterns_1 = require("./patterns");
async function rename(src, dest, dryrun) {
    if (!dryrun) {
        const parentOfDest = dest.substring(0, dest.lastIndexOf('/'));
        await promises_1.default.mkdir(parentOfDest, { recursive: true });
        await promises_1.default.rename(src, dest);
    }
    console.log(colors_1.default.yellow('MOVE'), dest);
}
async function move(dir, { dryrun, matcher, replace }) {
    let count = 0;
    await (0, eachDir_1.eachDir)(dir, async ({ folder, filename }) => {
        const filePath = node_path_1.default.join(folder, filename);
        // Do we match this one file...
        const match = filename.match(matcher);
        if (match?.input) {
            const dest = node_path_1.default.join(folder, filename.replaceAll(matcher, replace));
            await rename(filePath, dest, dryrun);
            count++;
            return;
        }
        // Check for long folder names...
        if (typeof matcher === 'string' && matcher.indexOf('/') >= 0) {
            try {
                const src = node_path_1.default.join(filePath, matcher);
                const stat = await promises_1.default.stat(src);
                if (stat.isDirectory()) {
                    const dest = node_path_1.default.join(filePath, replace);
                    await rename(src, dest, dryrun);
                    count++;
                }
            }
            catch (err) { } // ignore
        }
    });
    return count;
}
exports.move = move;
async function move_commands(opts, commands) {
    if (opts.current.name === opts.future.name) {
        return;
    }
    console.log(opts.current.name, opts.future.name);
    let count = 0;
    for (const command of commands) {
        const patterns = (0, patterns_1.filterPatterns)(command.patterns);
        if (patterns.length > 0) {
            // Iterate over the paths first to minimize the open/close of files
            for (const filePath of command.paths) {
                for (const pattern of patterns) {
                    let moved = await move(node_path_1.default.join(command.dir, filePath), {
                        dryrun: opts.dryrun,
                        matcher: pattern.matcher,
                        replace: pattern.replace,
                    });
                    count += moved;
                }
            }
        }
    }
    console.log(colors_1.default.green(`moved ${count} files or folders\n`));
}
exports.move_commands = move_commands;
async function move_all(opts) {
    const srcBundlePath = opts.current.bundle.replaceAll('.', '/'); // com/mobile
    const destBundlePath = opts.future.bundle.replaceAll('.', '/'); // com/example/mymobile
    await move_commands(opts, [
        {
            dir: opts.dir,
            paths: ['ios', 'android'],
            patterns: [
                // **/com.mobile -> **/com.example.mymobile  {current.bundle} -> {future.bundle}
                { matcher: srcBundlePath, replace: destBundlePath },
                // **/Mobile2 -> **/MyMobile  {current.name} -> {future.name}
                { matcher: opts.current.name, replace: opts.future.name },
            ],
        },
    ]);
}
exports.move_all = move_all;
//# sourceMappingURL=move_all.js.map