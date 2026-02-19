import * as fs from 'fs';
import * as path from 'path';

import { jrePath } from '../constants';
import { getExecutable } from './get-executable';
import { getSystemJavaHome } from './java-exists';

export async function getJavaCommand(jreInstallPath: string): Promise<string> {
  try {
    return getJavaString(jreInstallPath);
  } catch (e) {
    // ignore exception
  }

  const javaHome = await getSystemJavaHome();
  if (javaHome) {
    return path.join(javaHome, getExecutable());
  }

  throw Error('Unable to find locally-installed java or system-wide java');
}

function getJavaString(jreInstallPath: string): string {
  const pathOfJreFolder = path.join(
    path.resolve(jreInstallPath),
    '../',
    jrePath
  );

  const files = fs.readdirSync(pathOfJreFolder);
  const file = files
    .filter((name) => !name.startsWith('._'))
    .map((name) => path.join(pathOfJreFolder, name, getExecutable()))
    .filter(hasJavaExe);

  if (file.length == 0) {
    throw Error('JRE installation failed! Please install the package again.');
  }

  return file[0];
}

function hasJavaExe(javaExe: string): boolean {
  try {
    fs.accessSync(javaExe, fs.constants.X_OK);
    return true;
  } catch (e) {
    return false;
  }
}
