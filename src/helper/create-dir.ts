import * as fs from 'fs';

export function createDir(dir: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fs.access(dir, (err) => {
      if (err && err.code === 'ENOENT') {
        fs.mkdir(dir, (err) => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      } else if (!err) {
        resolve();
      } else {
        reject(err);
      }
    });
  });
}
