import { ChildProcess, spawn } from 'child_process';

import { getJavaCommand } from '../helper/java-command';

/**
 * Starts the class at the given path with given classpaths
 *
 * @export
 * @param {string} className Java classname to execute.
 * @param {string[]} [classPaths] optional Zip/Jar files to include to classpath.
 * @param {string[]} [args] optional arguments that will be appended while executing
 * @param {string} [jrePath] optional path to a JRE installation if other than default.
 * @returns {Promise<ChildProcess>}
 */
export async function executeClassWithCP(
  className: string,
  classPaths?: string[],
  args?: string[],
  jrePath?: string
): Promise<ChildProcess> {
  const jreInstallPath = resolveJREInstallPath(jrePath);
  const javaCommand = await getJavaCommand(jreInstallPath);
  const output = spawn(javaCommand, getClassArgs(className, classPaths, args));
  if (output.stderr) {
    output.stderr.pipe(process.stderr);
  }
  return output;
}

function getClassArgs(
  className: string,
  classPaths: string[] = [],
  args: string[] = []
): string[] {
  const ret = args.slice();
  ret.unshift(className);
  ret.unshift(joinPaths(classPaths));
  ret.unshift('-cp');
  return ret;
}

function joinPaths(paths: string[] = []): string {
  const pathSep = process.platform === 'win32' ? ';' : ':';
  return `${paths.join(pathSep)}`;
}

function resolveJREInstallPath(jrePath?: string) {
  if(jrePath != null) {
    return jrePath;
  }
  return __dirname;
}
