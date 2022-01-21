export type InstallOptions = {
  /**
   * Java Version. See https://api.adoptopenjdk.net/q/swagger-ui/#/Binary/getBinary to see
   * available versions besides the defined ones.
   * (defaults to 8)
   */
  feature_version?: 8 | 9 | 10 | 11 | 12 | number;

  /**
   * The Operating System (defaults to current).
   */
  os?: SupportedOs;

  /**
   * The Architecture (defaults to current).
   */
  arch?: SupportedArch;

  /**
   * Type of the downloaded binary (defaults to `jre`).
   */
  image_type?: ImageTypes;

  /**
   * OpenJDK Implementation (defaults to `hotspot`).
   */
  openjdk_impl?: JvmImplementation;

  /**
   * Type of the release. Release version (ga) or Early Access (ea) (defaults to `ga`).
   */
  release_type?: ReleaseTypes;

  /**
   * Heap Size (defaults to `normal`).
   */
  heap_size?: HeapSize;

  /**
   * Organisation that created the binary (defaults to `adoptopenjdk`).
   */
  vendor?: Vendors;

  /**
   * If set to true, the JRE won't be installed if java is already installed.
   * (defaults to false)
   */
  allow_system_java?: boolean;

  /**
   * The path where to install the JRE. (defaults to __dirname)
   */
   install_path?: string;
};

export const defaultOptions: InstallOptions = {
  feature_version: 8,
  image_type: 'jre',
  openjdk_impl: 'hotspot',
  release_type: 'ga',
  heap_size: 'normal',
  vendor: 'adoptopenjdk',
  allow_system_java: false,
  install_path: __dirname,
};

export type SupportedOs =
  | 'linux'
  | 'windows'
  | 'mac'
  | 'solaris'
  | 'aix'
  | 'alpine-linux';

const supportedArchitectures = [
  'x64',
  'x86',
  'x32',
  'ppc64',
  'ppc64le',
  's390x',
  'aarch64',
  'arm',
  'sparcv9',
  'riscv64',
] as const;

export type SupportedArch = typeof supportedArchitectures[number];

export const isSupportedArchitecture = (arch: string): boolean =>
  supportedArchitectures.includes(arch as SupportedArch);

export type ImageTypes =
  | 'jre'
  | 'jdk'
  | 'testimage'
  | 'debugimage'
  | 'staticlibs'
  | 'sources';

export type JvmImplementation = 'hotspot' | 'openj9' | 'dragonwell';

export type ReleaseTypes = 'ga' | 'ea';

export type HeapSize = 'normal' | 'large';

export type Vendors =
  | 'adoptopenjdk'
  | 'openjdk'
  | 'eclipse'
  | 'alibaba'
  | 'ibm';
