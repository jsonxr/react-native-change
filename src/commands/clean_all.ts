import colors from 'colors';
import fs from 'fs/promises';
import path from 'path';
import { ExecuteOptions } from '../options';
import { stat } from '../utils';

async function deleteFile(filePath: string, dryrun: boolean) {
  if (!dryrun) {
    await fs.rm(filePath, { recursive: true, force: true });
  }
  console.log(`${colors.red('DELETED')} ${filePath}`);
}

const clean = async (opts: ExecuteOptions, paths: string[]) => {
  const promises: Promise<any>[] = [];
  for (const filename of paths) {
    const filePath = path.join(opts.dir, filename);
    if (!(await stat(filePath))) {
      continue;
    }
    promises.push(deleteFile(filePath, opts.dryrun));
  }

  if (promises.length > 0) {
    await Promise.all(promises);
    console.log(colors.green(`Done removing ${promises.length} folders.\n`));
  }
};

export async function clean_all(opts: ExecuteOptions) {
  await clean(opts, [
    'ios/build',
    'ios/Pods',
    'android/.gradle',
    'android/app/build',
    'android/build',
  ]);
}
