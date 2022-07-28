import { AppJson, loadAndroidManifest, loadAppJson } from './utils/utils';

export type Options = {
  dir: string;
  name: string;
  dryrun: boolean;
  display: string;
  bundle: string;
};

const getNewName = (options: Options, appConfig: AppJson): string => {
  const name = options.name?.trim() ?? appConfig.name ?? appConfig.expo?.name;
  const pattern = /^([\p{Letter}\p{Number}])+([\p{Letter}\p{Number}\s]+)$/u;
  if (!pattern.test(name)) {
    console.log(
      `"${name}" is not a valid name for a project. Please use a valid identifier name (alphanumeric and space).`
    );
    throw new Error(
      `"${name}" is not a valid name for a project. Please use a valid identifier name (alphanumeric and space).`
    );
  }
  return name.replace(/\s/g, '');
};

// nS - No Space
// lC - Lowercase

type AppConfig = {
  name: string;
  display: string;
  bundle: string;
};
export type ExecuteOptions = {
  dryrun: boolean;
  ignore: string[];
  dir: string;
  current: AppConfig;
  future: AppConfig;
};
export const getExecuteOptions = async (
  options: Options
): Promise<ExecuteOptions> => {
  // current state
  const appJson = await loadAppJson(options.dir);
  const currentBundle = await loadAndroidManifest(options.dir);

  const current: AppConfig = {
    name: appJson.name,
    display: appJson.displayName,
    bundle: currentBundle,
  };
  // future state
  const name = getNewName(options, appJson);
  const display = options.display?.trim() ?? current.display;
  const bundle = options.bundle?.trim().toLocaleLowerCase() ?? currentBundle;

  const future: AppConfig = {
    name,
    display,
    bundle,
  };

  return {
    dryrun: options.dryrun ?? false,
    ignore: [],
    dir: options.dir,
    current,
    future,
  };
};
