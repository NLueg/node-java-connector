import { readdirSync } from 'fs';
import * as path from 'path';

import { jrePath } from '../constants';
import { getExecutable } from './get-executable';
import { systemJavaExists } from './java-exists';

export async function getJavaCommand(jreInstallPath: string): Promise<string> {
  try {
    return getJavaString(jreInstallPath);
  } catch (e) {
    // ignore exception
  }

  if (await systemJavaExists()) {
    return 'java';
  }

  throw Error('Unable to find locally-installed java or system-wide java');
}

function getJavaString(jreInstallPath: string): string {
  const pathOfJreFolder = path.join(path.resolve(jreInstallPath), '../', jrePath);

  const files = readdirSync(pathOfJreFolder);
  const file = files.filter((name) => !name.startsWith('._'));
  if (file.length > 1) {
    throw Error('JRE installation failed! Please install the package again.');
  }

  return path.join(pathOfJreFolder, file[0], getExecutable());
}
