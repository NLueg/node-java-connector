import * as crypto from 'crypto';
import * as fs from 'fs';
import fetch from 'node-fetch';
import * as path from 'path';

import { createDir } from '../helper/create-dir';
import { systemJavaExists } from '../helper/java-exists';
import { extract } from './extract';
import { generateInstallOptions } from './generate-install-options';
import { InstallOptions } from './install.typings';

const staticOpenJdkUrl = 'https://api.adoptopenjdk.net/v3/binary/latest/';

type OpenJdkReturnValue = { binaries: { [x: string]: string }[] };

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
  options?: InstallOptions
): Promise<string | undefined> {
  if (options?.allow_system_java == true && (await systemJavaExists())) {
    return Promise.resolve(undefined);
  }

  const installOptions = generateInstallOptions(options);
  const url = getUrlToCall(installOptions);

  console.log(url);

  const jreKeyPath = path.join(__dirname, 'jre-key');
  return fetch(url)
    .then((response) => response.json())
    .then((json) => {
      console.error(json);
      const receivedData: OpenJdkReturnValue = json as OpenJdkReturnValue;
      return downloadAll(jreKeyPath, receivedData.binaries[0]['binary_link']);
    })
    .then(verify)
    .then(move)
    .then(extract);
}

function getUrlToCall(options: InstallOptions): string {
  return `${staticOpenJdkUrl}${options.feature_version}/${options.release_type}/${options.os}/${options.arch}/${options.image_type}/${options.openjdk_impl}/${options.heap_size}/${options.vendor}`;
}

function download(dir: string, url: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    createDir(dir)
      .then(() => fetch(url))
      .then((response) => {
        const destinationFilePath = path.join(dir, path.basename(url));
        const destStream = fs.createWriteStream(destinationFilePath);
        response.body
          ?.pipe(destStream)
          .on('finish', () => resolve(destinationFilePath));
      })
      .catch((err) => reject(err));
  });
}

function downloadAll(dir: string, url: string): Promise<string> {
  return download(dir, url + '.sha256.txt').then(() => download(dir, url));
}

function genChecksum(filePath: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(crypto.createHash('sha256').update(data).digest('hex'));
    });
  });
}

function verify(filePath: string): Promise<string> {
  return new Promise<string>((resolve, reject) =>
    fs.readFile(filePath + '.sha256.txt', 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      }

      genChecksum(filePath).then((checksum) => {
        checksum === data.split('  ')[0]
          ? resolve(filePath)
          : reject(new Error("File and checksum don't match"));
      });
    })
  );
}

function move(filePath: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const newFilePath = path.join(
      __dirname,
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
