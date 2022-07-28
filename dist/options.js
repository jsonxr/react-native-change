"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExecuteOptions = void 0;
const utils_1 = require("./utils/utils");
const getNewName = (options, appConfig) => {
    const name = options.name?.trim() ?? appConfig.name ?? appConfig.expo?.name;
    const pattern = /^([\p{Letter}\p{Number}])+([\p{Letter}\p{Number}\s]+)$/u;
    if (!pattern.test(name)) {
        console.log(`"${name}" is not a valid name for a project. Please use a valid identifier name (alphanumeric and space).`);
        throw new Error(`"${name}" is not a valid name for a project. Please use a valid identifier name (alphanumeric and space).`);
    }
    return name.replace(/\s/g, '');
};
const getExecuteOptions = async (dir, options) => {
    // current state
    const appJson = await (0, utils_1.loadAppJson)(dir);
    const currentBundle = await (0, utils_1.loadAndroidManifest)(dir);
    const current = {
        name: appJson.name,
        display: appJson.displayName,
        bundle: currentBundle,
    };
    // future state
    const name = getNewName(options, appJson);
    const display = options.display?.trim() ?? current.display;
    const bundle = options.bundle?.trim().toLocaleLowerCase() ?? currentBundle;
    const future = {
        name,
        display,
        bundle,
    };
    return {
        dryrun: options.dryrun ?? false,
        ignore: [],
        dir,
        current,
        future,
    };
};
exports.getExecuteOptions = getExecuteOptions;
//# sourceMappingURL=options.js.map