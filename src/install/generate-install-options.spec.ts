import { generateInstallOptions } from './generate-install-options';

describe('generate-options', () => {
  it('generates default options if none is provided', () => {
    const defaultOptions = generateInstallOptions();
    expect(defaultOptions.feature_version).toBeDefined();
    expect(defaultOptions.os).toBeDefined();
    expect(defaultOptions.arch).toBeDefined();
    expect(defaultOptions.image_type).toBeDefined();
    expect(defaultOptions.openjdk_impl).toBeDefined();
    expect(defaultOptions.release_type).toBeDefined();
    expect(defaultOptions.heap_size).toBeDefined();
    expect(defaultOptions.vendor).toBeDefined();
    expect(defaultOptions.allow_system_java).toBeDefined();
    expect(defaultOptions.install_path).toBeDefined();
  });
});
