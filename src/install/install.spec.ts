import { generateInstallOptions } from './generate-install-options';
import { getUrlToCall } from './install';

describe('install-jdk', () => {
  it('creates valid url for default parameters', () => {
    const url = getUrlToCall({
      ...generateInstallOptions(),
      os: 'windows', // Required to get the correct url on every platform
    });
    expect(url).toBe(
      'https://api.adoptopenjdk.net/v3/binary/latest/8/ga/windows/x64/jre/hotspot/normal/adoptopenjdk'
    );
  });

  it('should include given parameters', () => {
    const url = getUrlToCall({
      feature_version: 12,
      heap_size: 'large',
      vendor: 'alibaba',
      openjdk_impl: 'dragonwell',
      arch: 'x86',
      release_type: 'ea',
      image_type: 'staticlibs',
      os: 'linux',
    });
    expect(url).toBe(
      'https://api.adoptopenjdk.net/v3/binary/latest/12/ea/linux/x86/staticlibs/dragonwell/large/alibaba'
    );
  });
});
