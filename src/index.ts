import 'source-map-support/register';
import { program } from 'commander';
import { execute } from './execute';
import { Options } from './options';

program
  .name('react-native-rename')
  .description('Rename a react-native application')
  .arguments('dir')
  .option('-n, --name [value]', 'Set name of app eg. "myapp"')
  .option('-d, --display [value]', 'Set display name of app eg. "My App"')
  .option(
    '-b, --bundle [value]',
    'Set custom bundle identifier eg. "com.example.myapp"'
  )
  .option('-d, --dryrun', 'Just output what will be done', false)
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(-1);
}

const dir = program.args[0];
const options = program.opts<Options>();
options.dir = dir;
execute(options);
