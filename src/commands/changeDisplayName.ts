import { ExecuteOptions } from '../options';
import { replace_commands } from './replace_all';
import colors from 'colors';

export async function changeDisplayName(opts: ExecuteOptions) {
  console.log(colors.green('change displayName...'));
  if (opts.current.display === opts.future.display) {
    return 0;
  }

  const count = await replace_commands(opts.dryrun, [
    {
      dir: opts.dir,
      paths: [
        opts.dryrun
          ? `ios/${opts.current.name}/Info.plist`
          : `ios/${opts.future.name}/Info.plist`,
      ],
      patterns: [
        {
          matcher: `<string>${opts.current.display}</string>`,
          replace: `<string>${opts.future.display}</string>`,
        },
      ],
    },
    {
      dir: opts.dir,
      paths: ['app.json'],
      patterns: [
        {
          matcher: `"displayName": "${opts.current.display}"`,
          replace: `"displayName": "${opts.future.display}"`,
        },
      ],
    },
    {
      dir: opts.dir,
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
    console.log(colors.green(`modified ${count} files\n`));
  }
}
