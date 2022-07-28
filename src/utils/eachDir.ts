import path from 'node:path';
import { getFiles, stat } from './utils';

export type EachDirCallback = (value: {
  folder: string;
  filename: string;
  isDirectory: boolean;
}) => Promise<void> | void;
export async function eachDir(filename: string, cb: EachDirCallback) {
  const files = await getFiles(filename);

  for (const filePath of files) {
    const src = path.join(filename, filePath);
    const file = await stat(src);
    if (!file) {
      console.error('File not found ', src);
      continue;
    }

    // Depth first so we can rename the folder and not cause problems...
    if (file.isDirectory()) {
      await eachDir(src, cb);
    }

    // Call this last so we can rename the file if we want
    await cb({
      folder: filename,
      filename: filePath,
      isDirectory: file.isDirectory(),
    });
  }
}
