"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
const changeDisplayName_1 = require("./commands/changeDisplayName");
const clean_all_1 = require("./commands/clean_all");
const move_all_1 = require("./commands/move_all");
const replace_all_1 = require("./commands/replace_all");
const options_1 = require("./options");
const execute = async (options) => {
    const opts = await (0, options_1.getExecuteOptions)(options);
    try {
        //await validatePaths(opts);
        await (0, clean_all_1.clean_all)(opts);
        await (0, move_all_1.move_all)(opts);
        await (0, changeDisplayName_1.changeDisplayName)(opts); // Need to change before generic because sometimes displayName = name
        await (0, replace_all_1.replace_all)(opts);
    }
    catch (err) {
        console.error(err);
    }
};
exports.execute = execute;
//# sourceMappingURL=execute.js.map