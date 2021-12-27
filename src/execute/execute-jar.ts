import { ChildProcess, spawn } from 'child_process';

import { getJavaCommand } from '../helper/java-command';

/**
 * Starts the jar at the given path
 *
 * @export
 * @param {string} jarPath path to the jar-file which should be executed
 * @param {string[]} [args] optional arguments that will be appended while executing
 * @returns {Promise<ChildProcess>}
 */
export async function executeJar(
  jarPath: string,
  args?: string[]
): Promise<ChildProcess> {
  const javaCommand = await getJavaCommand();
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
