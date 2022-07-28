import fs from 'fs/promises';
import path from 'path';
import { ExecuteOptions } from '../options';
import { eachDir } from '../utils/eachDir';
import { filterPatterns, Pattern, PatternCommand } from './patterns';
import colors from 'colors';

export type ReplaceOptions = {
  dryrun: boolean;
  patterns: Pattern[];
};
async function replace(
  dir: string,
  { dryrun, patterns }: ReplaceOptions
): Promise<number> {
  let count = 0;
  await eachDir(dir, async ({ folder, filename, isDirectory }) => {
    if (isDirectory) {
      return;
    }

    const filePath = path.join(folder, filename);
    let text = await fs.readFile(filePath, { encoding: 'utf-8' });
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
        await fs.writeFile(filePath, text, { encoding: 'utf-8' });
      }
      console.log(colors.yellow('MODIFY'), filePath);
    }
  });
  return count;
}

export async function replace_commands(
  dryrun: boolean,
  commands: PatternCommand[]
): Promise<number> {
  let count = 0;
  for (const command of commands) {
    const patterns = filterPatterns(command.patterns);
    if (patterns.length > 0) {
      // Iterate over the paths first to minimize the open/close of files
      for (const filePath of command.paths) {
        let replaced = await replace(path.join(command.dir, filePath), {
          dryrun,
          patterns,
        });
        count += replaced;
      }
    }
  }
  return count;
}

export async function replace_all(opts: ExecuteOptions) {
  console.log(colors.green('search/replace in files...'));
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
    console.log(colors.green(`modified ${count} files\n`));
  }
}
