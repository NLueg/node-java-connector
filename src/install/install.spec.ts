import { install } from './install';

// jest.mock('node-fetch');
// // eslint-disable-next-line import/first
// import fetch from 'node-fetch';

describe('install-jdk', () => {
  it('should install jdk', async () => {
    // (fetch as any).mockReturnValue(Promise.resolve({ json: () => '' }));

    const result = await install();
    expect(result).toBe(true);

    // expect(fetch).toHaveBeenCalledTimes(1);
    // expect(fetch).toHaveBeenCalledWith('http://website.com/users', {
    //   method: 'POST',
    // });
  });
});
