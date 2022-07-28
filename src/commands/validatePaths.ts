import colors from 'colors';
import fs from 'fs/promises';
import path from 'path';
import { ExecuteOptions } from '../options';
import { iosRequiredPaths } from '../utils/utils';

class ValidatePathsCommand {
  opts: ExecuteOptions;
  paths: string[];
  constructor(opts: ExecuteOptions) {
    this.opts = opts;
    this.paths = iosRequiredPaths(opts.current.name);
  }
  async execute() {
    for (const item of this.paths) {
      if (!(await fs.stat(path.join(this.opts.dir, item)))) {
        const warning = `Can't find an ios path or project. Make sure that the ios project path and property 'name' in app.json the same.`;
        throw new Error(warning);
      }
    }
  }
}

export const validatePaths = async (opts: ExecuteOptions) => {
  const paths = iosRequiredPaths(opts.current.name);

  const command = new ValidatePathsCommand(opts);
  for (const item of paths) {
    if (!(await fs.stat(path.join(opts.dir, item)))) {
      const warning = `Can't find an ios path or project. Make sure that the ios project path and property 'name' in app.json the same.`;
      throw new Error(warning);
    }
  }
};
