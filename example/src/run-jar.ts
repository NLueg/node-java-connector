import * as path from 'path';
import { executeJar } from '../../dist';

const relativePath = path.join(
  path.join(path.dirname(__dirname), 'example'),
  '../jar/Main.jar'
);

export default function executeTestJar(): Promise<string> {
  return executeJar(relativePath).then(
    (result) =>
      new Promise<string>((resolve) => {
        result.stdout?.on('data', (data) => {
          resolve(data.toString());
        });
      })
  );
}
