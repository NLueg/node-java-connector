import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';
import * as tar from 'tar';
import * as yauzl from 'yauzl';
import { Entry } from 'yauzl';

import { jrePath } from '../constants';
import { createDir } from '../helper/create-dir';

export function extract(filePath: string): Promise<string> {
  const dir = path.join(path.dirname(__dirname), jrePath);

  return createDir(dir).then(() => {
    return path.extname(filePath) === '.zip'
      ? extractZip(filePath, dir)
      : extractTarGz(filePath, dir);
  });
}

function extractTarGz(filePath: string, dir: string): Promise<string> {
  return tar.x({ file: filePath, cwd: dir }).then(
    () =>
      new Promise<string>((resolve, reject) => {
        fs.unlink(filePath, (err) => {
          if (err) {
            reject(err);
          }
          resolve(dir);
        });
      })
  );
}

function extractZip(filePath: string, dir: string): Promise<string> {
  return new Promise((resolve, reject) => {
    yauzl.open(filePath, { lazyEntries: true }, (err, zipFile) => {
      if (err) {
        reject(err);
      }

      zipFile?.readEntry();
      zipFile?.on('entry', (entry: Entry) => {
        const entryPath = path.join(dir, entry.fileName);

        if (/\/$/.test(entry.fileName)) {
          fs.mkdir(entryPath, { recursive: true }, (err) => {
            if (err && err.code !== 'EEXIST') {
              reject(err);
            }
            zipFile.readEntry();
          });
        } else {
          zipFile.openReadStream(
            entry,
            (err?: Error, readStream?: Readable) => {
              if (err) {
                reject(err);
              }

              readStream?.on('end', () => {
                zipFile.readEntry();
              });
              readStream?.pipe(fs.createWriteStream(entryPath));
            }
          );
        }
      });
      zipFile?.once('close', () => {
        fs.unlink(filePath, (err) => {
          if (err) {
            reject(err);
          }
          resolve(dir);
        });
      });
    });
  });
}
