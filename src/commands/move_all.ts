import colors from 'colors';
import fs from 'fs/promises';
import path from 'node:path';
import { ExecuteOptions } from '../options';
import { eachDir } from '../utils/eachDir';
import { filterPatterns, PatternCommand } from './patterns';

async function rename(src: string, dest: string, dryrun: boolean) {
  if (!dryrun) {
    const parentOfDest = dest.substring(0, dest.lastIndexOf('/'));
    await fs.mkdir(parentOfDest, { recursive: true });
    await fs.rename(src, dest);
  }
  console.log(colors.yellow('MOVE'), dest);
}

export type MoveOptions = {
  dryrun: boolean;
  matcher: string | RegExp;
  replace: string;
};
export async function move(
  dir: string,
  { dryrun, matcher, replace }: MoveOptions
): Promise<number> {
  let count = 0;
  await eachDir(dir, async ({ folder, filename }) => {
    const filePath = path.join(folder, filename);

    // Do we match this one file...
    const match = filename.match(matcher);
    if (match?.input) {
      const dest = path.join(folder, filename.replaceAll(matcher, replace));
      await rename(filePath, dest, dryrun);
      count++;
      return;
    }

    // Check for long folder names...
    if (typeof matcher === 'string' && matcher.indexOf('/') >= 0) {
      try {
        const src = path.join(filePath, matcher);
        const stat = await fs.stat(src);
        if (stat.isDirectory()) {
          const dest = path.join(filePath, replace);
          await rename(src, dest, dryrun);
          count++;
        }
      } catch (err) {} // ignore
    }
  });
  return count;
}

export async function move_commands(
  opts: ExecuteOptions,
  commands: PatternCommand[]
) {
  if (opts.current.name == opts.future.name) {
    return;
  }

  let count = 0;
  for (const command of commands) {
    const patterns = filterPatterns(command.patterns);
    if (patterns.length > 0) {
      // Iterate over the paths first to minimize the open/close of files
      for (const dir of command.paths) {
        for (const pattern of patterns) {
          let moved = await move(dir, {
            dryrun: opts.dryrun,
            matcher: pattern.matcher,
            replace: pattern.replace,
          });
          count += moved;
        }
      }
    }
  }

  console.log(colors.green(`moved ${count} files or folders\n`));
}

export async function move_all(opts: ExecuteOptions) {
  const srcBundlePath = opts.current.bundle.replaceAll('.', '/'); // com/mobile
  const destBundlePath = opts.future.bundle.replaceAll('.', '/'); // com/example/mymobile

  await move_commands(opts, [
    {
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
