const os = require('os');

export function getExecutable(): string {
    const platform = os.platform();
    switch (platform) {
        case 'darwin':
            return 'Contents/Home/bin/java';
        case 'win32': 
            return 'bin/java.exe';
        default:
            return 'bin/java';  // for example linux
      }
}