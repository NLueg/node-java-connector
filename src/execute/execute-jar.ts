import { ChildProcess, spawn } from 'child_process';

import { getJavaCommand } from '../helper/java-command';

/**
 * Starts the jar at the given path
 *
 * @export
 * @param {string} jarPath path to the jar-file which should be executed
 * @param {string[]} [args] optional arguments that will be appended while executing
 * @param {string} [jrePath] optional path to a JRE installation if other than default.
 * @returns {Promise<ChildProcess>}
 */
export async function executeJar(
  jarPath: string,
  args?: string[],
  jrePath?: string
): Promise<ChildProcess> {
  const jreInstallPath = resolveJREInstallPath(jrePath);
  const javaCommand = await getJavaCommand(jreInstallPath);
  const output = spawn(javaCommand, getJarArgs(jarPath, args));
  if (output.stderr) {
    output.stderr.pipe(process.stderr);
  }
  return output;
}

function getJarArgs(jarPath: string, args: string[] = []): string[] {
  const ret = args.slice();
  ret.unshift(jarPath);
  ret.unshift('-jar');
  return ret;
}

function resolveJREInstallPath(jrePath?: string) {
  if(jrePath != null) {
    return jrePath;
  }
  return __dirname;
}
