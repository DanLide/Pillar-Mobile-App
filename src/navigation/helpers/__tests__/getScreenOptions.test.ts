import { getScreenOptions } from '../getScreenOptions';

const params = {
  title: 'test',
};

describe('getScreenOptions', () => {
  it('return screenOptions object', () => {
    const result = getScreenOptions(params);
    expect(result.headerLeft).toBeDefined();
    expect(result.headerRight).toBeDefined();
    expect(result.headerTitle).toBeDefined();
    expect(result.headerStyle).toBeDefined();
  });
});
