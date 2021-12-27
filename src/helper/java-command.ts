import { readdirSync } from 'fs';
import * as path from 'path';

import { jrePath } from '../constants';
import { getExecutable } from './get-executable';
import { systemJavaExists } from './java-exists';

export async function getJavaCommand(): Promise<string> {
  try {
    return getJavaString();
  } catch (e) {
    // ignore exception
  }

  if (await systemJavaExists()) {
    return 'java';
  }

  throw Error('Unable to find locally-installed java or system-wide java');
}

function getJavaString(): string {
  const srcPath = path.join(path.resolve(__dirname), '../', jrePath);
  const files = readdirSync(srcPath);

  const file = files.filter((name) => !name.startsWith('._'));
  if (file.length > 1) {
    throw Error('JRE installation failed! Please install the package again.');
  }

  return path.join(srcPath, file[0], getExecutable());
}
