import { load } from 'cheerio';
import fs, { readFile } from 'fs/promises';
import { Stats } from 'node:fs';
import path from 'path';

export const stat = async (src: string): Promise<Stats | undefined> => {
  try {
    return await fs.stat(src);
  } catch (err) {} // ignore
};

export const getFiles = async (filename: string) => {
  let files: string[] = [];
  const file = await stat(filename);
  if (file) {
    if (file?.isDirectory()) {
      files = await fs.readdir(filename);
    } else {
      files = ['']; // We want just the filename...
    }
  }
  return files;
};

export const getBundlePath = (bundleId: string): string => {
  if (!bundleId) {
    throw new Error(
      'Invalid Bundle Identifier. Add something like "com.travelapp" or "com.junedomingo.travelapp"'
    );
  }

  const bundlePath = bundleId.replace(/\./g, '/');
  const id = bundleId.split('.');
  if (id.length < 2) {
    throw new Error(
      'Invalid Bundle Identifier. Add something like "com.travelapp" or "com.junedomingo.travelapp"'
    );
  }
  const validBundleID =
    /^([a-zA-Z]([a-zA-Z0-9_])*\.)+[a-zA-Z]([a-zA-Z0-9_])*$/u;
  if (!validBundleID.test(bundleId)) {
    throw new Error(
      'Invalid Bundle Identifier. It must have at least two segments (one or more dots). Each segment must start with a letter. All characters must be alphanumeric or an underscore [a-zA-Z0-9_]'
    );
  }
  return bundlePath;
};

export type AppJson = {
  name: string;
  expo?: { name: string };
  displayName: string;
};
export const loadAppJson = async (dir: string): Promise<AppJson> => {
  const text = await readFile(path.join(dir, 'app.json'), {
    encoding: 'utf-8',
  });
  return JSON.parse(text) as AppJson;
};

export const loadAndroidManifest = async (dir: string) => {
  const filename = path.join(dir, 'android/app/src/main/AndroidManifest.xml');
  const data = await readFile(filename);
  const $data = load(data);
  const bundleId = $data('manifest').attr('package');
  if (!bundleId) {
    throw new Error(`Could not load android manifest "${filename}"`);
  }
  return bundleId;
};

export function iosRequiredPaths(name: string) {
  return [`ios/${name}`];
}
