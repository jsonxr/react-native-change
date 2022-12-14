import { changeDisplayName } from './commands/changeDisplayName';
import { clean_all } from './commands/clean_all';
import { move_all } from './commands/move_all';
import { replace_all } from './commands/replace_all';
import { getExecuteOptions, Options } from './options';

export const execute = async (options: Options) => {
  const opts = await getExecuteOptions(options);

  try {
    //await validatePaths(opts);
    await clean_all(opts);
    await move_all(opts);
    await changeDisplayName(opts); // Need to change before generic because sometimes displayName = name
    await replace_all(opts);
  } catch (err) {
    console.error(err);
  }
};
