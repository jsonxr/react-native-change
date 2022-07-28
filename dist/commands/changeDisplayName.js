"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeDisplayName = void 0;
const replace_all_1 = require("./replace_all");
const colors_1 = __importDefault(require("colors"));
async function changeDisplayName(opts) {
    // const text = `{
    //   "name": "MyApp",
    //   "displayName": "My Mobile"
    // }`.replaceAll(`"displayName": "${opts.current.display}"`, `"displayName": "${opts.future.display}"`);
    // console.log('text:', text);
    if (opts.current.display === opts.future.display) {
        return 0;
    }
    const count = await (0, replace_all_1.replace_commands)(opts.dryrun, [
        {
            paths: [`ios/${opts.future.name}/Info.plist`, `ios/${opts.current.name}/Info.plist`],
            patterns: [
                {
                    matcher: `<string>${opts.current.display}</string>`,
                    replace: `<string>${opts.future.display}</string>`,
                },
            ],
        },
        {
            paths: ['app.json'],
            patterns: [
                {
                    matcher: `"displayName": "${opts.current.display}"`,
                    replace: `"displayName": "${opts.future.display}"`,
                },
            ],
        },
        {
            paths: ['android/app/src/main/res/values/strings.xml'],
            patterns: [
                {
                    matcher: `<string name="app_name">${opts.current.display}</string>`,
                    replace: `<string name="app_name">${opts.future.display}</string>`,
                },
            ],
        },
    ]);
    if (count > 0) {
        console.log(colors_1.default.green(`display: modified ${count} files\n`));
    }
}
exports.changeDisplayName = changeDisplayName;
//# sourceMappingURL=changeDisplayName.js.map