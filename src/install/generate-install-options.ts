import {
  defaultOptions,
  InstallOptions,
  isSupportedArchitecture,
  SupportedArch,
  SupportedOs,
} from './install.typings';

export function generateInstallOptions(
  parameter?: InstallOptions
): InstallOptions {
  const optionsWithDefault = {
    ...defaultOptions,
    ...parameter,
  };

  if (!optionsWithDefault.os) {
    optionsWithDefault.os = getOperatingSystem();
  }

  if (!optionsWithDefault.arch) {
    optionsWithDefault.arch = getArchitecture();
  }

  return optionsWithDefault;
}

function getOperatingSystem(): SupportedOs {
  switch (process.platform) {
    case 'aix':
      return 'aix';
    case 'darwin':
      return 'mac';
    case 'linux':
      return 'linux';
    case 'sunos':
      return 'solaris';
    case 'win32':
      return 'windows';
    default:
      throw new Error('Unsupported operating system');
  }
}

function getArchitecture(): SupportedArch {
  if (isSupportedArchitecture(process.arch)) {
    return process.arch as SupportedArch;
  }

  switch (process.arch) {
    case 'ia32':
      return 'x32';
    case 'arm64':
      return 'aarch64';
    case 's390':
      return 's390x';
    default:
      throw new Error('Unsupported architecture');
  }
}
