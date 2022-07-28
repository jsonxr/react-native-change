"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const execute_1 = require("./execute");
commander_1.program
    .name('react-native-rename')
    .description('Rename a react-native application')
    .arguments('dir')
    .option('-n, --name [value]', 'Set name of app eg. "myapp"')
    .option('-d, --display [value]', 'Set display name of app eg. "myapp". If none provided, uses existing')
    .option('-b, --bundle [value]', 'Set custom bundle identifier eg. "com.example.myapp"')
    .option('-d, --dryrun', "Don't actually do anything, just output what will be done", false)
    .parse(process.argv);
if (!process.argv.slice(2).length) {
    commander_1.program.outputHelp();
    process.exit(-1);
}
const dir = commander_1.program.args[0];
const options = commander_1.program.opts();
(0, execute_1.execute)(dir, options);
//# sourceMappingURL=index.js.map