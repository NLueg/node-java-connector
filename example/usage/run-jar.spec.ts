import executeTestJar from './run-jar';

describe('run test-jar', () => {
  it('should run test-jar', async () => {
    const result = await executeTestJar();
    expect(result).toBe('Hello world');
  });
});
