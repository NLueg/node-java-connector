export const jrePath = 'dist/jre';


const os = require('os');
export function getExecutable(): string {
    const platform = os.platform();
    switch (platform) {
        case 'linux':
        case 'darwin': 
            return 'java';
        case 'win32': 
            return 'java.exe';
        default:
          throw Error ('unsupported platform: ' + platform);
      }
}