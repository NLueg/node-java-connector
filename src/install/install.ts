/* eslint-disable unused-imports/no-unused-vars,@typescript-eslint/no-unused-vars */
import * as fs from 'fs';
import fetch from 'node-fetch';
import * as path from 'path';

import { createDir } from '../helper/create-dir';
import { systemJavaExists } from '../helper/java-exists';
import { extract } from './extract';
import { generateInstallOptions } from './generate-install-options';
import { InstallOptions } from './install.typings';

const staticOpenJdkUrl = 'https://api.adoptopenjdk.net/v3/binary/latest/';

/**
 * Installs a JRE copy for the app
 * @param options Installation Options for the JRE
 * @return Promise<string> - Resolves to the installation directory or rejects an error
 * @example
 *  const njc = require('node-java-connector')
 *
 *  // Use default options
 *  njc.install()
 *    .then(dir => {
 *      // Do stuff
 *    })
 *    .catch(err => {
 *      // Handle the error
 *    })
 *
 *  // or custom ones
 *  njc.install({ 11, os: 'aix', arch: 'ppc64', openjdk_impl: 'openj9' })
 *    .then(dir => {
 *      // Do stuff
 *    })
 *    .catch(err => {
 *      // Handle the error
 *    })
 */
export async function install(
  givenOptions?: InstallOptions
): Promise<string | undefined> {
  if (givenOptions?.allow_system_java == true && (await systemJavaExists())) {
    return Promise.resolve(undefined);
  }

  const options = generateInstallOptions(givenOptions);
  const url = getUrlToCall(options);

  const installPath = `${options.install_path}`;
  const jreKeyPath = path.join(installPath, 'jre');
  return download(jreKeyPath, url)
    .then((downloadPath) => moveOneFolderUp(downloadPath, installPath))
    .then((filePath) => extract(filePath, installPath));
}

export function getUrlToCall(options: InstallOptions): string {
  return `${staticOpenJdkUrl}${options.feature_version}/${options.release_type}/${options.os}/${options.arch}/${options.image_type}/${options.openjdk_impl}/${options.heap_size}/${options.vendor}`;
}

function download(dir: string, url: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    createDir(dir)
      .then(() => fetch(url))
      .then((response) => {
        const fileName = response.headers
          .get('content-disposition')
          ?.split('=')[1];
        const destinationFilePath = path.join(
          dir,
          fileName ?? path.basename(url)
        );
        const destStream = fs.createWriteStream(destinationFilePath);

        response.body
          ?.pipe(destStream)
          .on('finish', () => resolve(destinationFilePath))
          .once('error', (err) => reject(err));
      })
      .catch((err) => reject(err));
  });
}

function moveOneFolderUp(
  filePath: string,
  installPath: string
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const newFilePath = path.join(
      installPath,
      filePath.split(path.sep).slice(-1)[0]
    );

    fs.copyFile(filePath, newFilePath, (err) => {
      if (err) {
        reject(err);
      }

      fs.unlink(filePath, (err) => {
        if (err) {
          reject(err);
        }
        resolve(newFilePath);
      });
    });
  });
}
